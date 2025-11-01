import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ✅ GET — ดึงข้อมูล surface items ทั้งหมด
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows]: any = await connection.query(`
      SELECT item_id, image, link
      FROM product_surface_items
      ORDER BY item_id DESC
    `);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /productsurface error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST — เพิ่มรายการใหม่
export async function POST(req: Request) {
  try {
    const { image, link } = await req.json();
    if (!image || !link) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const connection = await getConnection();
    await connection.execute(
      `
      INSERT INTO product_surface_items (image, link)
      VALUES (?, ?)
      `,
      [image, link]
    );
    await connection.end();

    return NextResponse.json({ message: "Surface item added successfully" });
  } catch (error: any) {
    console.error("POST /productsurface error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT — แก้ไขข้อมูล
export async function PUT(req: Request) {
  try {
    const { item_id, image, link } = await req.json();
    if (!item_id)
      return NextResponse.json({ error: "Missing item_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      UPDATE product_surface_items
      SET image = COALESCE(?, image),
          link = COALESCE(?, link)
      WHERE item_id = ?
      `,
      [image, link, item_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Surface item updated successfully" });
  } catch (error: any) {
    console.error("PUT /productsurface error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE — ลบรายการ
export async function DELETE(req: Request) {
  try {
    const { item_id } = await req.json();
    if (!item_id)
      return NextResponse.json({ error: "Missing item_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM product_surface_items WHERE item_id = ?`,
      [item_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Surface item deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /productsurface error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
