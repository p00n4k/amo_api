import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

type ProjectRow = RowDataPacket & {
  project_id: number;
  project_name: string;
  data_update: string; // ถ้าเป็น Date ใน db ก็จะยัง serialize ออกมาเป็น string ได้
  project_category: string;
};

type ProjectImageRow = RowDataPacket & {
  image_url: string;
};

type CollectionRow = RowDataPacket & {
  collection_id: number;
  collection_name: string | null;
  type: string | null;
  brand_name: string | null;
  material_type: string | null;
  status: number | boolean | null; // บางทีมาเป็น 0/1
  description: string | null;
  image: string | null;
  link: string | null;
  relate_link: string | null;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    const connection = await getConnection();

    // 🔹 1) Fetch project info (ใช้ ? เพื่อปลอดภัย)
    const [projectRows] = await connection.query<ProjectRow[]>(
      `
      SELECT 
        p.project_id,
        p.project_name,
        p.data_update,
        p.project_category
      FROM projects p
      WHERE p.project_id = ?
      LIMIT 1
    `,
      [projectId]
    );

    if (projectRows.length === 0) {
      await connection.end();
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = projectRows[0];

    // 🔹 2) Fetch images
    const [imageRows] = await connection.query<ProjectImageRow[]>(
      `
      SELECT image_url
      FROM project_images
      WHERE project_id = ?
      ORDER BY display_order ASC
    `,
      [projectId]
    );

    // 🔹 3) Fetch collections with brand info
    const [collectionRows] = await connection.query<CollectionRow[]>(
      `
      SELECT 
        c.collection_id,
        c.collection_name,
        c.type,
        b.brand_name,
        c.material_type,
        c.status,
        c.description,
        c.image,
        c.link,
        c.relate_link
      FROM project_collections pc
      LEFT JOIN collections c ON pc.collection_id = c.collection_id
      LEFT JOIN brands b ON c.brand_id = b.brand_id
      WHERE pc.project_id = ?
      ORDER BY c.collection_id ASC
    `,
      [projectId]
    );

    await connection.end();

    const result = [
      {
        project_id: project.project_id,
        project_name: project.project_name,
        data_update: project.data_update,
        project_category: project.project_category,
        project_images: imageRows.map((i) => i.image_url),
        collections: collectionRows.map((c) => ({
          collection_id: c.collection_id,
          collection_name: c.collection_name,
          type: c.type,
          brand_name: c.brand_name,
          material_type: c.material_type,
          status: Boolean(c.status),
          description: c.description,
          image: c.image,
          link: c.link,
          relate_link: c.relate_link,
        })),
      },
    ];

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching project detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch project detail", details: error?.message },
      { status: 500 }
    );
  }
}
