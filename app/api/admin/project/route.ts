import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ✅ GET – ดึงข้อมูลทั้งหมด หรือเฉพาะ project_id ที่ระบุ
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const project_id = url.searchParams.get("project_id");
    const connection = await getConnection();

    if (project_id) {
      // ✅ ดึงข้อมูลโครงการเดียว พร้อมรูปภาพ
      const [rows]: any = await connection.query(
        `
        SELECT 
          p.project_id,
          p.project_name,
          p.data_update,
          p.project_category
        FROM projects p
        WHERE p.project_id = ?
        `,
        [project_id]
      );

      const [images]: any = await connection.query(
        `
        SELECT image_id, image_url, display_order 
        FROM project_images 
        WHERE project_id = ? 
        ORDER BY display_order ASC
        `,
        [project_id]
      );

      await connection.end();

      if (rows.length === 0)
        return NextResponse.json({ error: "Project not found" }, { status: 404 });

      return NextResponse.json({
        ...rows[0],
        images: images || [],
      });
    } else {
      // ✅ ดึงข้อมูลทั้งหมด
      const [rows]: any = await connection.query(`
        SELECT project_id, project_name, data_update, project_category
        FROM projects
        ORDER BY data_update DESC
      `);
      await connection.end();
      return NextResponse.json(rows);
    }
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}

// ✅ POST – เพิ่มโครงการใหม่
export async function POST(req: Request) {
  try {
    const { project_name, data_update, project_category } = await req.json();

    // 🟢 แปลงวันที่เป็น YYYY-MM-DD
    const formattedDate = new Date(data_update).toISOString().split("T")[0];

    const connection = await getConnection();
    await connection.query(
      `
      INSERT INTO projects (project_name, data_update, project_category)
      VALUES (?, ?, ?)
      `,
      [project_name, formattedDate, project_category]
    );
    await connection.end();

    return NextResponse.json({ message: "Project created successfully" });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}

// ✅ PUT – แก้ไขข้อมูลโครงการ
export async function PUT(req: Request) {
  try {
    const { project_id, project_name, data_update, project_category } =
      await req.json();

    // 🟢 แปลงวันที่เป็น YYYY-MM-DD (แก้ปัญหา Incorrect date value)
    const formattedDate = new Date(data_update).toISOString().split("T")[0];

    const connection = await getConnection();
    await connection.query(
      `
      UPDATE projects
      SET project_name = ?, data_update = ?, project_category = ?
      WHERE project_id = ?
      `,
      [project_name, formattedDate, project_category, project_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Project updated successfully" });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE – ลบโครงการ (และรูปภาพใน project_images)
export async function DELETE(req: Request) {
  try {
    const { project_id } = await req.json();
    const connection = await getConnection();

    await connection.query(`DELETE FROM project_images WHERE project_id = ?`, [
      project_id,
    ]);
    await connection.query(`DELETE FROM projects WHERE project_id = ?`, [
      project_id,
    ]);

    await connection.end();

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
