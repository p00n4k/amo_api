import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  let connection: any;

  try {
    connection = await getConnection();

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
        (
          SELECT pfi.image_url
          FROM product_focus_images pfi
          WHERE pfi.focus_id = pf.focus_id
          ORDER BY pfi.display_order ASC
          LIMIT 1
        ) AS image_url
      FROM product_focus pf
      LEFT JOIN brands b ON pf.brand_id = b.brand_id
      WHERE pf.type = 'Furnishing'
      ORDER BY pf.focus_id DESC
    `);

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'No furnishing product focus found' },
        { status: 404 }
      );
    }

    const items = rows.map((r: any) => ({
      focus_id: r.focus_id,
      collection_name: r.collection_name,
      brand_name: r.brand_name,
      brand_image: r.brand_image,
      description: r.description,
      made_in: r.made_in,
      type: r.type,
      link: r.link,
      images: r.image_url ? [r.image_url] : [], // 🔥 1 image only
    }));

    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Error fetching furnishing product focus:', error);

    return NextResponse.json(
      { error: 'Failed to fetch furnishing product focus' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end(); // ✅ ปิด connection เสมอ
  }
}
