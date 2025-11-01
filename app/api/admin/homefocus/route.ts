import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — แสดง Focus Product ทั้งหมด พร้อมรูปภาพ
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const focus_id = searchParams.get("focus_id");

    const connection = await getConnection();

    // ✅ ถ้ามี focus_id = ดึงข้อมูล + รูปภาพของ focus นั้น
    if (focus_id) {
      const [focusData]: any = await connection.query(
        `
        SELECT 
          pf.focus_id,
          pf.collection_name,
          b.brand_name,
          b.brand_image,
          pf.description,
          pf.made_in,
          pf.type,
          pf.link
        FROM product_focus pf
        LEFT JOIN brands b ON pf.brand_id = b.brand_id
        WHERE pf.focus_id = ?
        `,
        [focus_id]
      );

      const [images]: any = await connection.query(
        `
        SELECT image_id, image_url, display_order
        FROM product_focus_images
        WHERE focus_id = ?
        ORDER BY display_order ASC
        `,
        [focus_id]
      );

      await connection.end();

      if (focusData.length === 0) {
        return NextResponse.json({ error: "Focus not found" }, { status: 404 });
      }

      return NextResponse.json({
        ...focusData[0],
        images: images,
      });
    }

    // ✅ ไม่มี focus_id = ดึงทั้งหมด พร้อมรูปภาพ
    const [rows]: any = await connection.query(`
      SELECT 
        pf.focus_id,
        pf.collection_name,
        b.brand_name,
        b.brand_image,
        pf.description,
        pf.made_in,
        pf.type,
        pf.link,
        pf.brand_id
      FROM product_focus pf
      LEFT JOIN brands b ON pf.brand_id = b.brand_id
      ORDER BY pf.focus_id DESC
    `);

    // ✅ ดึงรูปภาพของแต่ละ focus
    for (let focus of rows) {
      const [images]: any = await connection.query(
        `
        SELECT image_id, image_url, display_order
        FROM product_focus_images
        WHERE focus_id = ?
        ORDER BY display_order ASC
        `,
        [focus.focus_id]
      );
      focus.images = images.map((img: any) => img.image_url);
    }

    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /homefocus error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 POST — เพิ่ม Focus Product ใหม่ หรือ เพิ่มรูปภาพ
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    const connection = await getConnection();

    // ✅ เพิ่มรูปภาพเข้า focus ที่มีอยู่
    if (action === "add_image") {
      const { focus_id, image_url, display_order } = body;

      if (!focus_id || !image_url) {
        return NextResponse.json(
          { error: "Missing focus_id or image_url" },
          { status: 400 }
        );
      }

      await connection.execute(
        `
        INSERT INTO product_focus_images (focus_id, image_url, display_order)
        VALUES (?, ?, ?)
        `,
        [focus_id, image_url, display_order || 0]
      );

      await connection.end();
      return NextResponse.json({ message: "Image added successfully" });
    }

    // ✅ เพิ่ม Focus Product ใหม่
    const { collection_name, brand_name, description, made_in, type, link } = body;

    if (!collection_name || !brand_name || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ หา brand_id จาก brand_name
    const [brandResult]: any = await connection.query(
      `SELECT brand_id FROM brands WHERE brand_name = ? LIMIT 1`,
      [brand_name]
    );

    if (brandResult.length === 0) {
      await connection.end();
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brand_id = brandResult[0].brand_id;

    // ✅ เพิ่ม focus ใหม่
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

// 🟠 PUT — แก้ไข Focus Product
export async function PUT(req: Request) {
  try {
    const {
      focus_id,
      collection_name,
      brand_name,
      description,
      made_in,
      type,
      link,
    } = await req.json();

    if (!focus_id) {
      return NextResponse.json({ error: "Missing focus_id" }, { status: 400 });
    }

    const connection = await getConnection();

    // ✅ ถ้ามีการเปลี่ยน brand_name ให้หา brand_id ใหม่
    let brand_id = null;
    if (brand_name) {
      const [brandResult]: any = await connection.query(
        `SELECT brand_id FROM brands WHERE brand_name = ? LIMIT 1`,
        [brand_name]
      );

      if (brandResult.length > 0) {
        brand_id = brandResult[0].brand_id;
      }
    }

    // ✅ อัปเดตข้อมูล
    await connection.execute(
      `
      UPDATE product_focus
      SET 
        collection_name = COALESCE(?, collection_name),
        brand_id = COALESCE(?, brand_id),
        description = COALESCE(?, description),
        made_in = COALESCE(?, made_in),
        type = COALESCE(?, type),
        link = COALESCE(?, link)
      WHERE focus_id = ?
      `,
      [collection_name, brand_id, description, made_in, type, link, focus_id]
    );

    await connection.end();
    return NextResponse.json({ message: "Focus Product updated successfully" });
  } catch (error: any) {
    console.error("PUT /homefocus error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE — ลบ Focus Product หรือ ลบรูปภาพ
export async function DELETE(req: Request) {
  try {
    const { focus_id, image_id, action } = await req.json();

    const connection = await getConnection();

    // ✅ ลบรูปภาพ
    if (action === "delete_image" && image_id) {
      await connection.execute(
        `DELETE FROM product_focus_images WHERE image_id = ?`,
        [image_id]
      );
      await connection.end();
      return NextResponse.json({ message: "Image deleted successfully" });
    }

    // ✅ ลบ Focus Product (รูปภาพจะถูกลบตาม CASCADE)
    if (!focus_id) {
      return NextResponse.json({ error: "Missing focus_id" }, { status: 400 });
    }

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