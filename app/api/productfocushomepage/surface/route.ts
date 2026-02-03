import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(`
      SELECT 
        pf.focus_id,
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
      ORDER BY pf.focus_id DESC, pfi.display_order ASC
    `);

    await connection.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'No surface product focus found' },
        { status: 404 }
      );
    }

    // ✅ Group by focus_id
    const map = new Map<number, any>();

    for (const r of rows as any[]) {
      const id = Number(r.focus_id);

      if (!map.has(id)) {
        map.set(id, {
          focus_id: id,
          collection_name: r.collection_name,
          brand_name: r.brand_name,
          brand_image: r.brand_image,
          description: r.description,
          made_in: r.made_in,
          type: r.type,
          link: r.link,
          images: [],
        });
      }

      // ✅ push image only if not null + not duplicate
      if (r.image_url) {
        const item = map.get(id);
        if (!item.images.includes(r.image_url)) {
          item.images.push(r.image_url);
        }
      }
    }

    // ✅ return array (all Surface)
    return NextResponse.json(Array.from(map.values()));
  } catch (error: any) {
    console.error('Error fetching surface product focus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surface product focus', details: error.message },
      { status: 500 }
    );
  }
}
