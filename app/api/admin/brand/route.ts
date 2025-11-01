import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — ดูข้อมูลแบรนด์ทั้งหมด
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT 
        brand_id,
        brand_name,
        brand_image,
        main_type,
        type,
        brand_url,
        created_at
      FROM brands
      ORDER BY brand_id ASC
    `);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /brand error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 POST — เพิ่ม Brand ใหม่
export async function POST(req: Request) {
  try {
    const { brand_name, brand_image, main_type, type, brand_url } = await req.json();

    if (!brand_name || !main_type || !type)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const connection = await getConnection();
    await connection.execute(
      `
      INSERT INTO brands (brand_name, brand_image, main_type, type, brand_url)
      VALUES (?, ?, ?, ?, ?)
      `,
      [brand_name, brand_image, main_type, type, brand_url || "https://amo.co.th"]
    );
    await connection.end();

    return NextResponse.json({ message: "Brand added successfully" });
  } catch (error: any) {
    console.error("POST /brand error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟠 PUT — แก้ไข Brand
export async function PUT(req: Request) {
  try {
    const { brand_id, brand_name, brand_image, main_type, type, brand_url } = await req.json();

    if (!brand_id)
      return NextResponse.json({ error: "Missing brand_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      UPDATE brands
      SET 
        brand_name = COALESCE(?, brand_name),
        brand_image = COALESCE(?, brand_image),
        main_type = COALESCE(?, main_type),
        type = COALESCE(?, type),
        brand_url = COALESCE(?, brand_url)
      WHERE brand_id = ?
      `,
      [brand_name, brand_image, main_type, type, brand_url, brand_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Brand updated successfully" });
  } catch (error: any) {
    console.error("PUT /brand error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE — ลบ Brand
export async function DELETE(req: Request) {
  try {
    const { brand_id } = await req.json();

    if (!brand_id)
      return NextResponse.json({ error: "Missing brand_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(`DELETE FROM brands WHERE brand_id = ?`, [brand_id]);
    await connection.end();

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /brand error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
