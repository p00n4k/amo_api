import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — ดึงข้อมูล Product Main ทั้งหมด
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const connection = await getConnection();

    if (id) {
      const [rows]: any = await connection.query(
        `
        SELECT pm.id, pm.collection_name, b.brand_name, b.brand_image, pm.link
        FROM product_main pm
        LEFT JOIN brands b ON pm.brand_id = b.brand_id
        WHERE pm.id = ?
      `,
        [id]
      );

      const [images]: any = await connection.query(
        `SELECT image_id, image_url FROM product_main_images WHERE product_main_id = ?`,
        [id]
      );

      await connection.end();

      if (rows.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      return NextResponse.json({ ...rows[0], images });
    }

    // ✅ ดึงทั้งหมด พร้อมรูปภาพ
    const [rows]: any = await connection.query(`
      SELECT pm.id, pm.collection_name, b.brand_name, b.brand_image, pm.link
      FROM product_main pm
      LEFT JOIN brands b ON pm.brand_id = b.brand_id
      ORDER BY pm.id DESC
    `);

    // ✅ ดึงรูปภาพของแต่ละ product
    for (let product of rows) {
      const [images]: any = await connection.query(
        `SELECT image_id, image_url FROM product_main_images WHERE product_main_id = ?`,
        [product.id]
      );
      product.images = images;
    }

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
    console.log("📥 POST body:", body);

    const connection = await getConnection();

    // ✅ เพิ่มรูปภาพ
    if (body.action === "add_image") {
      const { product_main_id, image_url } = body;

      // ✅ Validate ข้อมูล
      if (!product_main_id || !image_url) {
        await connection.end();
        return NextResponse.json(
          { error: "Missing product_main_id or image_url" },
          { status: 400 }
        );
      }

      // ✅ ตรวจสอบว่า image_url เป็น string
      if (typeof image_url !== "string") {
        await connection.end();
        return NextResponse.json(
          { error: "image_url must be a string path" },
          { status: 400 }
        );
      }

      console.log("📸 Adding image:", { product_main_id, image_url });

      await connection.query(
        `INSERT INTO product_main_images (product_main_id, image_url) VALUES (?, ?)`,
        [product_main_id, image_url]
      );

      await connection.end();
      return NextResponse.json({ message: "Image added successfully!" });
    }

    // ✅ เพิ่ม Product Main
    const { collection_name, brand_name, link } = body;

    if (!collection_name || !brand_name) {
      await connection.end();
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ หา brand_id จาก brand_name
    const [brand]: any = await connection.query(
      `SELECT brand_id FROM brands WHERE brand_name = ? LIMIT 1`,
      [brand_name]
    );

    if (brand.length === 0) {
      await connection.end();
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brand_id = brand[0].brand_id;

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

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const connection = await getConnection();

    // ✅ หา brand_id จาก brand_name
    let brand_id = null;
    if (brand_name) {
      const [brand]: any = await connection.query(
        `SELECT brand_id FROM brands WHERE brand_name = ? LIMIT 1`,
        [brand_name]
      );

      if (brand.length > 0) {
        brand_id = brand[0].brand_id;
      }
    }

    await connection.query(
      `UPDATE product_main
       SET 
         collection_name = COALESCE(?, collection_name),
         brand_id = COALESCE(?, brand_id),
         link = COALESCE(?, link)
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

    // ✅ ลบรูปภาพ
    if (body.action === "delete_image") {
      const { image_id } = body;

      if (!image_id) {
        await connection.end();
        return NextResponse.json(
          { error: "Missing image_id" },
          { status: 400 }
        );
      }

      await connection.query(
        `DELETE FROM product_main_images WHERE image_id = ?`,
        [image_id]
      );

      await connection.end();
      return NextResponse.json({ message: "Image deleted successfully!" });
    }

    // ✅ ลบ Product Main
    const { id } = body;

    if (!id) {
      await connection.end();
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await connection.query(`DELETE FROM product_main WHERE id = ?`, [id]);

    await connection.end();
    return NextResponse.json({ message: "Product Main deleted successfully!" });
  } catch (error: any) {
    console.error("DELETE /admin/productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}