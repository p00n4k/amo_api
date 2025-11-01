import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET — ดึงโปรเจกต์ล่าสุด (สูงสุด 4)
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT 
        project_id,
        project_name,
        data_update,
        project_category,
        display_order
      FROM projects
      ORDER BY data_update DESC, display_order ASC
      LIMIT 4
    `);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /homelastproject error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟠 PUT — อัปเดตลำดับหรือหมวดหมู่
export async function PUT(req: Request) {
  try {
    const { project_id, display_order, project_category } = await req.json();

    if (!project_id)
      return NextResponse.json(
        { error: "Missing project_id" },
        { status: 400 }
      );

    const connection = await getConnection();

    // ✅ ปรับเฉพาะ field ที่ส่งมา (COALESCE จะคงค่าเดิมไว้ถ้าไม่ส่ง)
    await connection.execute(
      `
      UPDATE projects
      SET 
        display_order = COALESCE(?, display_order),
        project_category = COALESCE(?, project_category)
      WHERE project_id = ?
      `,
      [display_order, project_category, project_id]
    );

    await connection.end();

    return NextResponse.json({ message: "Project updated successfully" });
  } catch (error: any) {
    console.error("PUT /homelastproject error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
