import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT brand_id, brand_name, brand_image, main_type, type, brand_url
      FROM brands
      ORDER BY brand_id ASC
    `);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error fetching brands:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ กรองข้อมูล image ให้เหลือแค่ path
    const brand_image =
      typeof body.brand_image === "object"
        ? body.brand_image?.url || body.brand_image?.filePath || ""
        : body.brand_image || "";

    const { brand_name, main_type, type, brand_url } = body;

    if (!brand_name || !main_type || !type)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const connection = await getConnection();
    await connection.query(
      `INSERT INTO brands (brand_name, brand_image, main_type, type, brand_url)
       VALUES (?, ?, ?, ?, ?)`,
      [brand_name, brand_image, main_type, type, brand_url || "https://amo.co.th"]
    );

    return NextResponse.json({ message: "Brand created successfully!" });
  } catch (error: any) {
    console.error("Error creating brand:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // ✅ ตัด fileList/file ออกจาก object
    const rawImage = body.brand_image;
    let brand_image = "";

    if (typeof rawImage === "object") {
      // ถ้าเป็น array (เช่น fileList)
      if (Array.isArray(rawImage)) {
        brand_image = rawImage[0]?.url || rawImage[0]?.response?.url || "";
      } else {
        brand_image =
          rawImage.url ||
          rawImage.filePath ||
          rawImage.response?.url ||
          rawImage[0]?.url ||
          "";
      }
    } else {
      brand_image = rawImage || "";
    }

    const { brand_id, brand_name, main_type, type, brand_url } = body;

    if (!brand_id)
      return NextResponse.json({ error: "Missing brand_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.query(
      `UPDATE brands
       SET brand_name = ?, brand_image = ?, main_type = ?, type = ?, brand_url = ?
       WHERE brand_id = ?`,
      [brand_name, brand_image, main_type, type, brand_url || "https://amo.co.th", brand_id]
    );

    return NextResponse.json({ message: "Brand updated successfully!" });
  } catch (error: any) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { brand_id } = await req.json();
    const connection = await getConnection();
    await connection.query(`DELETE FROM brands WHERE brand_id = ?`, [brand_id]);
    return NextResponse.json({ message: "Brand deleted successfully!" });
  } catch (error: any) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
