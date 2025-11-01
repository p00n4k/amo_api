import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — ดูโปรเจกต์ทั้งหมด + paginate
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const connection = await getConnection();

    const [rows] = await connection.query(`
      SELECT 
        project_id,
        project_name,
        data_update,
        project_category,
        display_order
      FROM projects
      ORDER BY data_update DESC, project_id DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    const [totalRows]: any = await connection.query(`
      SELECT COUNT(*) AS total FROM projects
    `);

    await connection.end();

    const total = totalRows[0].total;

    return NextResponse.json({
      projects: rows,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /admin/project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 POST — เพิ่มโปรเจกต์ใหม่
export async function POST(req: Request) {
  try {
    const { project_name, data_update, project_category } = await req.json();

    if (!project_name || !data_update || !project_category)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const connection = await getConnection();
    await connection.execute(
      `
      INSERT INTO projects (project_name, data_update, project_category)
      VALUES (?, ?, ?)
      `,
      [project_name, data_update, project_category]
    );
    await connection.end();

    return NextResponse.json({ message: "Project added successfully" });
  } catch (error: any) {
    console.error("POST /admin/project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟠 PUT — แก้ไขชื่อ/หมวด/วันที่
export async function PUT(req: Request) {
  try {
    const { project_id, project_name, data_update, project_category } =
      await req.json();

    if (!project_id)
      return NextResponse.json({ error: "Missing project_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      UPDATE projects
      SET 
        project_name = COALESCE(?, project_name),
        data_update = COALESCE(?, data_update),
        project_category = COALESCE(?, project_category)
      WHERE project_id = ?
      `,
      [project_name, data_update, project_category, project_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Project updated successfully" });
  } catch (error: any) {
    console.error("PUT /admin/project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE — ลบโปรเจกต์
export async function DELETE(req: Request) {
  try {
    const { project_id } = await req.json();

    if (!project_id)
      return NextResponse.json({ error: "Missing project_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(`DELETE FROM projects WHERE project_id = ?`, [
      project_id,
    ]);
    await connection.end();

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /admin/project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
