import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 GET - ดึงข้อมูลทั้งหมด หรือเฉพาะโปรเจกต์เดียว (พร้อมภาพ)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const project_id = url.searchParams.get("project_id");
    const connection = await getConnection();

    if (project_id) {
      const [projects]: any = await connection.query(
        `
        SELECT project_id, project_name, data_update, project_category
        FROM projects
        WHERE project_id = ?
        `,
        [project_id]
      );

      if (projects.length === 0)
        return NextResponse.json({ error: "Project not found" }, { status: 404 });

      const [images]: any = await connection.query(
        `
        SELECT image_id, image_url
        FROM project_images
        WHERE project_id = ?
        ORDER BY display_order ASC
        `,
        [project_id]
      );

      await connection.end();
      return NextResponse.json({
        ...projects[0],
        project_images: images,
      });
    }

    // ✅ ดึงข้อมูลทุกโปรเจกต์
    const [rows]: any = await connection.query(
      `
      SELECT p.project_id, p.project_name, p.data_update, p.project_category
      FROM projects p
      ORDER BY p.project_id DESC
      `
    );

    // ดึงภาพทั้งหมด
    const [allImages]: any = await connection.query(`
      SELECT project_id, image_url
      FROM project_images
    `);

    // ผูกภาพกับโปรเจกต์
    const projectsWithImages = rows.map((p: any) => ({
      ...p,
      project_images: allImages
        .filter((img: any) => img.project_id === p.project_id)
        .map((i: any) => i.image_url),
    }));

    await connection.end();
    return NextResponse.json(projectsWithImages);
  } catch (error: any) {
    console.error("GET /project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 POST - เพิ่มโปรเจกต์ใหม่ หรือเพิ่มรูป
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { project_name, project_category, data_update, action } = data;
    const connection = await getConnection();

    // ✅ กรณีเพิ่มรูปภาพ
    if (action === "add_image") {
      const { project_id, image_url } = data;
      await connection.query(
        `INSERT INTO project_images (project_id, image_url) VALUES (?, ?)`,
        [project_id, image_url]
      );
      await connection.end();
      return NextResponse.json({ message: "Image added" });
    }

    // 🟢 แปลงวันที่ให้ปลอดภัย
    const formattedDate =
      data_update && !isNaN(Date.parse(data_update))
        ? new Date(data_update).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

    await connection.query(
      `
      INSERT INTO projects (project_name, project_category, data_update)
      VALUES (?, ?, ?)
      `,
      [project_name, project_category, formattedDate]
    );

    await connection.end();
    return NextResponse.json({ message: "Project created" });
  } catch (error: any) {
    console.error("POST /project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟠 PUT - แก้ไขโปรเจกต์
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { project_id, project_name, project_category, data_update } = data;
    const connection = await getConnection();

    const formattedDate =
      data_update && !isNaN(Date.parse(data_update))
        ? new Date(data_update).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

    await connection.query(
      `
      UPDATE projects
      SET project_name = ?, project_category = ?, data_update = ?
      WHERE project_id = ?
      `,
      [project_name, project_category, formattedDate, project_id]
    );

    await connection.end();
    return NextResponse.json({ message: "Project updated" });
  } catch (error: any) {
    console.error("PUT /project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE - ลบโปรเจกต์ หรือรูป
export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const connection = await getConnection();

    if (data.action === "delete_image") {
      await connection.query(`DELETE FROM project_images WHERE image_id = ?`, [
        data.image_id,
      ]);
      await connection.end();
      return NextResponse.json({ message: "Image deleted" });
    }

    if (data.project_id) {
      await connection.query(`DELETE FROM projects WHERE project_id = ?`, [
        data.project_id,
      ]);
      await connection.end();
      return NextResponse.json({ message: "Project deleted" });
    }

    await connection.end();
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error: any) {
    console.error("DELETE /project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
