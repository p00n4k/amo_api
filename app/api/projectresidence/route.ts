import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '4', 10);
    const offset = (page - 1) * limit;

    const connection = await getConnection();

    // ✅ FIXED: Avoid two placeholders in LIMIT/OFFSET
    const [projects] = await connection.query(`
      SELECT 
        p.project_id,
        p.project_name,
        p.data_update,
        p.project_category
      FROM projects p
      WHERE p.project_category = 'Residential'
      ORDER BY p.data_update DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    if (!Array.isArray(projects) || projects.length === 0) {
      await connection.end();
      return NextResponse.json({
        projects: [],
        pagination: { page, limit, total: 0 },
      });
    }

    const projectIds = (projects as any[]).map((p) => p.project_id);

    // 🔹 Related images
    const [images] = await connection.query(`
      SELECT project_id, image_url
      FROM project_images
      WHERE project_id IN (${projectIds.join(',')})
      ORDER BY display_order ASC
    `);

    // 🔹 Related collections
    const [collections] = await connection.query(`
      SELECT 
        pc.project_id,
        c.collection_id,
        c.type
      FROM project_collections pc
      LEFT JOIN collections c ON pc.collection_id = c.collection_id
      WHERE pc.project_id IN (${projectIds.join(',')})
    `);

    await connection.end();

    // 🔹 Combine results
    const result = (projects as any[]).map((p) => ({
      project_id: p.project_id,
      project_name: p.project_name,
      data_update: p.data_update,
      project_category: p.project_category,
      project_images: (images as any[])
        .filter((i) => i.project_id === p.project_id)
        .map((i) => i.image_url),
      collections: (collections as any[])
        .filter((c) => c.project_id === p.project_id)
        .map((c) => ({
          collection_id: c.collection_id,
          type: c.type,
        })),
    }));

    return NextResponse.json({
      projects: result,
      pagination: { page, limit, total: result.length },
    });
  } catch (error: any) {
    console.error('Error fetching project residence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project residence', details: error.message },
      { status: 500 }
    );
  }
}
