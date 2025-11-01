import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 🔹 Fetch Surface focus items (joined with brand and images)
    const [rows] = await connection.execute(`
      SELECT 
        pf.collection_name,
        b.brand_name,
        b.brand_image,
        pf.description,
        pf.made_in,
        pf.type,
        pf.link,
        pfi.image_url
      FROM product_focus pf
      LEFT JOIN brands b ON pf.brand_id = b.brand_id
      LEFT JOIN product_focus_images pfi ON pf.focus_id = pfi.focus_id
      WHERE pf.type = 'Surface'
      ORDER BY pf.focus_id, pfi.display_order ASC
    `);

    await connection.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No surface product focus found' }, { status: 404 });
    }

    // 🔹 Group image URLs together
    const item = {
      collection_name: rows[0].collection_name,
      brand_name: rows[0].brand_name,
      brand_image: rows[0].brand_image,
      description: rows[0].description,
      made_in: rows[0].made_in,
      type: rows[0].type,
      link: rows[0].link,
      images: rows.map((r: any) => r.image_url),
    };

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Error fetching surface product focus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surface product focus', details: error.message },
      { status: 500 }
    );
  }
}
