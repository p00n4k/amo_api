import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — แสดง Collection ทั้งหมด
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT 
        c.collection_id,
        c.type,
        b.brand_name,
        c.material_type,
        c.status,
        c.description,
        c.image,
        c.link,
        c.relate_link,
        c.created_at
      FROM collections c
      LEFT JOIN brands b ON c.brand_id = b.brand_id
      ORDER BY c.collection_id DESC
    `);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /collection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 POST — เพิ่ม Collection ใหม่
export async function POST(req: Request) {
  try {
    const { type, brand_id, material_type, status, description, image, link, relate_link } =
      await req.json();

    if (!type || !brand_id || !material_type)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const connection = await getConnection();
    await connection.execute(
      `
      INSERT INTO collections 
      (type, brand_id, material_type, status, description, image, link, relate_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [type, brand_id, material_type, status ? 1 : 0, description, image, link, relate_link]
    );
    await connection.end();

    return NextResponse.json({ message: "Collection added successfully" });
  } catch (error: any) {
    console.error("POST /collection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟠 PUT — แก้ไขข้อมูล Collection
export async function PUT(req: Request) {
  try {
    const { collection_id, type, brand_id, material_type, status, description, image, link, relate_link } =
      await req.json();

    if (!collection_id)
      return NextResponse.json({ error: "Missing collection_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      UPDATE collections
      SET 
        type = COALESCE(?, type),
        brand_id = COALESCE(?, brand_id),
        material_type = COALESCE(?, material_type),
        status = COALESCE(?, status),
        description = COALESCE(?, description),
        image = COALESCE(?, image),
        link = COALESCE(?, link),
        relate_link = COALESCE(?, relate_link)
      WHERE collection_id = ?
      `,
      [
        type,
        brand_id,
        material_type,
        status !== undefined ? (status ? 1 : 0) : null,
        description,
        image,
        link,
        relate_link,
        collection_id,
      ]
    );
    await connection.end();

    return NextResponse.json({ message: "Collection updated successfully" });
  } catch (error: any) {
    console.error("PUT /collection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE — ลบ Collection
export async function DELETE(req: Request) {
  try {
    const { collection_id } = await req.json();

    if (!collection_id)
      return NextResponse.json({ error: "Missing collection_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM collections WHERE collection_id = ?`,
      [collection_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Collection deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /collection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
