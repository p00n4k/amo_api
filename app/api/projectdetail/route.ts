import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ error: 'Missing project id' }, { status: 400 });
    }

    const connection = await getConnection();

    // 🔹 1. Fetch project info
    const [projectRows] = await connection.query(`
      SELECT 
        p.project_id,
        p.project_name,
        p.data_update,
        p.project_category
      FROM projects p
      WHERE p.project_id = ${connection.escape(projectId)}
      LIMIT 1
    `);

    if (!Array.isArray(projectRows) || projectRows.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projectRows[0];

    // 🔹 2. Fetch images
    const [imageRows] = await connection.query(`
      SELECT image_url
      FROM project_images
      WHERE project_id = ${connection.escape(projectId)}
      ORDER BY display_order ASC
    `);

    // 🔹 3. Fetch collections with brand info (✅ เพิ่ม c.collection_name)
    const [collectionRows] = await connection.query(`
      SELECT 
        c.collection_id,
        c.collection_name,     -- ✅ NEW
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
      WHERE pc.project_id = ${connection.escape(projectId)}
      ORDER BY c.collection_id ASC
    `);

    await connection.end();

    // 🔹 4. Build final JSON structure (✅ ส่ง collection_name ออกไปด้วย)
    const result = [
      {
        project_id: project.project_id,
        project_name: project.project_name,
        data_update: project.data_update,
        project_category: project.project_category,
        project_images: imageRows.map((i: any) => i.image_url),
        collections: collectionRows.map((c: any) => ({
          collection_id: c.collection_id,
          collection_name: c.collection_name, // ✅ NEW
          type: c.type,
          brand_name: c.brand_name,
          material_type: c.material_type,
          status: !!c.status,
          description: c.description,
          image: c.image,
          link: c.link,
          relate_link: c.relate_link,
        })),
      },
    ];

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching project detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project detail', details: error.message },
      { status: 500 }
    );
  }
}
