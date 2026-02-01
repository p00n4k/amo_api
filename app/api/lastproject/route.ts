import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const connection = await getConnection();

    // ✅ ดึงโปรเจกต์ล่าสุด 4 อัน (ทุก category)
    const [rows] = await connection.execute(`
      SELECT 
        p.project_id,
        p.project_name,
        p.data_update,
        p.project_category,
        (
          SELECT pi.image_url
          FROM project_images pi
          WHERE pi.project_id = p.project_id
          ORDER BY pi.display_order ASC
          LIMIT 1
        ) AS cover_image
      FROM projects p
      ORDER BY p.data_update DESC
      LIMIT 4
    `);

    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error fetching latest projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest projects", details: error.message },
      { status: 500 }
    );
  }
}
