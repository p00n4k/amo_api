import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const connection = await getConnection();

    // ✅ ดึงโปรเจกต์ล่าสุด 4 รายการ พร้อมรูป cover (รูปแรกสุดของโปรเจกต์)
    const [rows] = await connection.execute(`
      SELECT 
        p.project_id,
        p.project_name,
        p.data_update,
        p.project_category,
        pi.image_url AS cover_image
      FROM projects p
      LEFT JOIN project_images pi 
        ON p.project_id = pi.project_id
      WHERE pi.display_order = (
        SELECT MIN(display_order)
        FROM project_images
        WHERE project_id = p.project_id
      ) OR pi.display_order IS NULL
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
