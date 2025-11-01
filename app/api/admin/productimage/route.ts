import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — แสดงภาพทั้งหมด
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT 
        item_id,
        image,
        link,
        category,
        created_at
      FROM product_images
      ORDER BY item_id DESC
    `);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /productimage error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 POST — เพิ่มภาพใหม่
export async function POST(req: Request) {
  try {
    const { image, link, category } = await req.json();

    if (!image)
      return NextResponse.json({ error: "Missing image path" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      INSERT INTO product_images (image, link, category)
      VALUES (?, ?, ?)
      `,
      [image, link, category || "Surface"]
    );
    await connection.end();

    return NextResponse.json({ message: "Product image added successfully" });
  } catch (error: any) {
    console.error("POST /productimage error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE — ลบภาพ
export async function DELETE(req: Request) {
  try {
    const { item_id } = await req.json();

    if (!item_id)
      return NextResponse.json({ error: "Missing item_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(`DELETE FROM product_images WHERE item_id = ?`, [
      item_id,
    ]);
    await connection.end();

    return NextResponse.json({ message: "Product image deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /productimage error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
