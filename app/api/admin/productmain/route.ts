import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — ดึงข้อมูล Product Main ทั้งหมด
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const connection = await getConnection();

    if (id) {
      const [rows] = await connection.query(
        `
        SELECT pm.id, pm.collection_name, b.brand_name, pm.link
        FROM product_main pm
        LEFT JOIN brands b ON pm.brand_id = b.brand_id
        WHERE pm.id = ?
      `,
        [id]
      );

      const [images] = await connection.query(
        `SELECT image_id, image_url FROM product_main_images WHERE product_main_id = ?`,
        [id]
      );

      await connection.end();
      return NextResponse.json({ ...rows[0], images });
    }

    const [rows] = await connection.query(`
      SELECT pm.id, pm.collection_name, b.brand_name, pm.link
      FROM product_main pm
      LEFT JOIN brands b ON pm.brand_id = b.brand_id
      ORDER BY pm.id DESC
    `);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /admin/productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 POST — เพิ่ม Product Main หรือรูปภาพ
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const connection = await getConnection();

    // ✅ เพิ่มรูปภาพ
    if (body.action === "add_image") {
      const { product_main_id, image_url } = body;
      await connection.query(
        `INSERT INTO product_main_images (product_main_id, image_url) VALUES (?, ?)`,
        [product_main_id, image_url]
      );
      await connection.end();
      return NextResponse.json({ message: "Image added successfully!" });
    }

    // ✅ เพิ่ม Product Main
    const { collection_name, brand_name, link } = body;
    const [brand] = await connection.query(
      `SELECT brand_id FROM brands WHERE brand_name = ?`,
      [brand_name]
    );

    const brand_id = brand?.[0]?.brand_id || null;

    await connection.query(
      `INSERT INTO product_main (collection_name, brand_id, link) VALUES (?, ?, ?)`,
      [collection_name, brand_id, link]
    );
    await connection.end();
    return NextResponse.json({ message: "Product Main created successfully!" });
  } catch (error: any) {
    console.error("POST /admin/productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔵 PUT — แก้ไข Product Main
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, collection_name, brand_name, link } = body;

    const connection = await getConnection();
    const [brand] = await connection.query(
      `SELECT brand_id FROM brands WHERE brand_name = ?`,
      [brand_name]
    );

    const brand_id = brand?.[0]?.brand_id || null;

    await connection.query(
      `UPDATE product_main
       SET collection_name = ?, brand_id = ?, link = ?
       WHERE id = ?`,
      [collection_name, brand_id, link, id]
    );
    await connection.end();
    return NextResponse.json({ message: "Product Main updated successfully!" });
  } catch (error: any) {
    console.error("PUT /admin/productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE — ลบ Product Main หรือรูปภาพ
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const connection = await getConnection();

    if (body.action === "delete_image") {
      await connection.query(
        `DELETE FROM product_main_images WHERE image_id = ?`,
        [body.image_id]
      );
      await connection.end();
      return NextResponse.json({ message: "Image deleted successfully!" });
    }

    await connection.query(`DELETE FROM product_main WHERE id = ?`, [body.id]);
    await connection.end();
    return NextResponse.json({ message: "Product Main deleted successfully!" });
  } catch (error: any) {
    console.error("DELETE /admin/productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
