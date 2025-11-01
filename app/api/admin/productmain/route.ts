import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — ดูสินค้าหลักทั้งหมด
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT 
        pm.id,
        pm.collection_name,
        b.brand_name,
        pm.link,
        pm.created_at
      FROM product_main pm
      LEFT JOIN brands b ON pm.brand_id = b.brand_id
      ORDER BY pm.id DESC
    `);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 POST — เพิ่มสินค้าใหม่
export async function POST(req: Request) {
  try {
    const { collection_name, brand_id, link } = await req.json();

    if (!collection_name || !brand_id)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const connection = await getConnection();
    await connection.execute(
      `
      INSERT INTO product_main (collection_name, brand_id, link)
      VALUES (?, ?, ?)
      `,
      [collection_name, brand_id, link]
    );
    await connection.end();

    return NextResponse.json({ message: "Product main added successfully" });
  } catch (error: any) {
    console.error("POST /productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟠 PUT — แก้ไขข้อมูลสินค้า
export async function PUT(req: Request) {
  try {
    const { id, collection_name, brand_id, link } = await req.json();

    if (!id)
      return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      UPDATE product_main
      SET 
        collection_name = COALESCE(?, collection_name),
        brand_id = COALESCE(?, brand_id),
        link = COALESCE(?, link)
      WHERE id = ?
      `,
      [collection_name, brand_id, link, id]
    );
    await connection.end();

    return NextResponse.json({ message: "Product main updated successfully" });
  } catch (error: any) {
    console.error("PUT /productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE — ลบสินค้า
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id)
      return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(`DELETE FROM product_main WHERE id = ?`, [id]);
    await connection.end();

    return NextResponse.json({ message: "Product main deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
