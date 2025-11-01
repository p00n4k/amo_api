import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ✅ GET — ดึงข้อมูลทั้งหมด
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows]: any = await connection.query(`
      SELECT
        pm.id,
        pm.collection_name,
        b.brand_name,
        pm.link
      FROM product_main pm
      LEFT JOIN brands b ON pm.brand_id = b.brand_id
      ORDER BY pm.id DESC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}

// ✅ POST — เพิ่มข้อมูลใหม่
export async function POST(req: Request) {
  try {
    const { collection_name, brand_name, link } = await req.json();
    const connection = await getConnection();

    // หา brand_id จากชื่อ brand
    const [brand]: any = await connection.query(
      `SELECT brand_id FROM brands WHERE brand_name = ? LIMIT 1`,
      [brand_name]
    );

    const brand_id = brand.length > 0 ? brand[0].brand_id : null;

    await connection.query(
      `
      INSERT INTO product_main (collection_name, brand_id, link)
      VALUES (?, ?, ?)
      `,
      [collection_name, brand_id, link]
    );

    return NextResponse.json({ message: "Product main added successfully" });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}

// ✅ PUT — แก้ไขข้อมูล
export async function PUT(req: Request) {
  try {
    const { id, collection_name, brand_name, link } = await req.json();
    const connection = await getConnection();

    // หา brand_id จากชื่อ brand
    const [brand]: any = await connection.query(
      `SELECT brand_id FROM brands WHERE brand_name = ? LIMIT 1`,
      [brand_name]
    );
    const brand_id = brand.length > 0 ? brand[0].brand_id : null;

    await connection.query(
      `
      UPDATE product_main
      SET collection_name = ?, brand_id = ?, link = ?
      WHERE id = ?
      `,
      [collection_name, brand_id, link, id]
    );

    return NextResponse.json({ message: "Product main updated successfully" });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE — ลบข้อมูล
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const connection = await getConnection();

    // ลบภาพใน product_main_images ก่อน (เพราะมี FK)
    await connection.query(`DELETE FROM product_main_images WHERE product_main_id = ?`, [id]);
    await connection.query(`DELETE FROM product_main WHERE id = ?`, [id]);

    return NextResponse.json({ message: "Product main deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
