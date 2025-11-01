import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — แสดง Focus Product ทั้งหมด
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT 
        pf.focus_id,
        pf.collection_name,
        b.brand_name,
        pf.description,
        pf.made_in,
        pf.type,
        pf.link
      FROM product_focus pf
      LEFT JOIN brands b ON pf.brand_id = b.brand_id
      ORDER BY pf.focus_id DESC
    `);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /homefocus error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 POST — เพิ่ม Focus Product ใหม่
export async function POST(req: Request) {
  try {
    const { collection_name, brand_id, description, made_in, type, link } =
      await req.json();

    if (!collection_name || !brand_id || !type)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const connection = await getConnection();
    await connection.execute(
      `
      INSERT INTO product_focus (collection_name, brand_id, description, made_in, type, link)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [collection_name, brand_id, description, made_in, type, link]
    );
    await connection.end();

    return NextResponse.json({ message: "Focus Product added successfully" });
  } catch (error: any) {
    console.error("POST /homefocus error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟠 PUT — แก้ไขข้อมูล Focus Product
export async function PUT(req: Request) {
  try {
    const { focus_id, collection_name, description, made_in, type, link } =
      await req.json();

    if (!focus_id)
      return NextResponse.json({ error: "Missing focus_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      UPDATE product_focus
      SET 
        collection_name = COALESCE(?, collection_name),
        description = COALESCE(?, description),
        made_in = COALESCE(?, made_in),
        type = COALESCE(?, type),
        link = COALESCE(?, link)
      WHERE focus_id = ?
      `,
      [collection_name, description, made_in, type, link, focus_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Focus Product updated successfully" });
  } catch (error: any) {
    console.error("PUT /homefocus error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE — ลบ Focus Product
export async function DELETE(req: Request) {
  try {
    const { focus_id } = await req.json();

    if (!focus_id)
      return NextResponse.json({ error: "Missing focus_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(`DELETE FROM product_focus WHERE focus_id = ?`, [
      focus_id,
    ]);
    await connection.end();

    return NextResponse.json({ message: "Focus Product deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /homefocus error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
