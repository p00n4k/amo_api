import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ===============================
// 🟢 GET — ดึงข้อมูลทั้งหมด
// ===============================
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT 
        c.collection_id,
        c.collection_name,
        c.type,
        c.brand_id,
        b.brand_name,
        c.material_type,
        c.status,
        c.description,
        c.image,
        c.link,
        c.relate_link
      FROM collections c
      LEFT JOIN brands b ON c.brand_id = b.brand_id
      ORDER BY c.collection_id DESC
    `);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("❌ Error fetching collections:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===============================
// 🟡 POST — เพิ่มข้อมูลใหม่
// ===============================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log("📥 Received body:", body);

    // ✅ ดึงเฉพาะ fields ที่ต้องการ (กรอง file และ fileList ออก)
    const {
      collection_name,
      type,
      brand_id,
      material_type,
      status,
      description,
      image,
      link,
      relate_link,
    } = body;

    // ✅ Validate required fields
    if (!collection_name || !type || !brand_id || !material_type) {
      return NextResponse.json(
        { error: "Missing required fields: collection_name, type, brand_id, material_type" },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    
    // ✅ ใช้ parameterized query เพื่อป้องกัน SQL injection
    const [result] = await connection.query(
      `INSERT INTO collections
       (collection_name, type, brand_id, material_type, status, description, image, link, relate_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        collection_name,
        type,
        brand_id,
        material_type,
        status ?? true,
        description || '',
        image || '',
        link || '',
        relate_link || ''
      ]
    );

    console.log("✅ Collection created successfully");
    return NextResponse.json({ 
      success: true, 
      message: "Collection created successfully",
      collection_id: (result as any).insertId
    });
  } catch (error: any) {
    console.error("❌ Error inserting collection:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===============================
// 🟠 PUT — แก้ไขข้อมูล
// ===============================
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    console.log("📥 Received body for update:", body);

    // ✅ ดึงเฉพาะ fields ที่ต้องการ
    const {
      collection_id,
      collection_name,
      type,
      brand_id,
      material_type,
      status,
      description,
      image,
      link,
      relate_link,
    } = body;

    if (!collection_id) {
      return NextResponse.json({ error: "Missing collection_id" }, { status: 400 });
    }

    const connection = await getConnection();
    
    // ✅ ใช้ parameterized query
    await connection.query(
      `UPDATE collections
       SET collection_name=?, type=?, brand_id=?, material_type=?, status=?, 
           description=?, image=?, link=?, relate_link=?
       WHERE collection_id=?`,
      [
        collection_name,
        type,
        brand_id,
        material_type,
        status ?? true,
        description || '',
        image || '',
        link || '',
        relate_link || '',
        collection_id
      ]
    );

    console.log("✅ Collection updated successfully");
    return NextResponse.json({ success: true, message: "Collection updated successfully" });
  } catch (error: any) {
    console.error("❌ Error updating collection:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===============================
// 🔴 DELETE — ลบข้อมูล
// ===============================
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { collection_id } = body;

    if (!collection_id) {
      return NextResponse.json({ error: "Missing collection_id" }, { status: 400 });
    }

    const connection = await getConnection();
    await connection.query("DELETE FROM collections WHERE collection_id = ?", [collection_id]);

    console.log("✅ Collection deleted successfully");
    return NextResponse.json({ success: true, message: "Collection deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting collection:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}