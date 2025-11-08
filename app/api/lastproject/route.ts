import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const connection = await getConnection();

    // ✅ ดึง 2 โปรเจกต์ Residential ล่าสุด
    const [residentialRows] = await connection.execute(`
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
      WHERE p.project_category = 'Residential'
      ORDER BY p.data_update DESC
      LIMIT 2
    `);

    // ✅ ดึง 2 โปรเจกต์ Commercial ล่าสุด
    const [commercialRows] = await connection.execute(`
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
      WHERE p.project_category = 'Commercial'
      ORDER BY p.data_update DESC
      LIMIT 2
    `);

    await connection.end();

    // ✅ รวมผลลัพธ์ (Residential 2 + Commercial 2)
    const projects = [...residentialRows, ...commercialRows];

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Error fetching categorized projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch categorized projects", details: error.message },
      { status: 500 }
    );
  }
}
