import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = (page - 1) * limit;

    const connection = await getConnection();

    // ✅ 1. Get TOTAL COUNT
    const [countRows]: any = await connection.query(`
      SELECT COUNT(*) AS total
      FROM projects p
      WHERE p.project_category = 'Residential'
    `);

    const total = Number(countRows?.[0]?.total ?? 0);

    // ✅ 2. Get paginated projects
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
        pagination: { page, limit, total },
      });
    }

    const projectIds = (projects as any[]).map((p) => p.project_id);

    // ✅ 3. Get images
    const [images] = await connection.query(`
      SELECT project_id, image_url
      FROM project_images
      WHERE project_id IN (${projectIds.join(',')})
      ORDER BY display_order ASC
    `);

    // ✅ 4. Get collections (เปลี่ยน c.type -> c.collection_name)
    const [collections] = await connection.query(`
      SELECT
        pc.project_id,
        c.collection_id,
        c.collection_name
      FROM project_collections pc
      LEFT JOIN collections c ON pc.collection_id = c.collection_id
      WHERE pc.project_id IN (${projectIds.join(',')})
    `);

    await connection.end();

    // ✅ 5. Combine data
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
          collection_name: c.collection_name,
        })),
    }));

    // ✅ 6. Return with correct pagination
    return NextResponse.json({
      projects: result,
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching project residence:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch project residence',
        details: error.message,
      },
      { status: 500 }
    );
  }
}