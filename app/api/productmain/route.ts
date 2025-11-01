import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 🔹 Query joins product_main, brands, and product_main_images
    const [rows] = await connection.execute(`
      SELECT 
        pm.collection_name,
        b.brand_name,
        pm.link,
        pmi.image_url
      FROM product_main pm
      LEFT JOIN brands b ON pm.brand_id = b.brand_id
      LEFT JOIN product_main_images pmi ON pm.id = pmi.product_main_id
      ORDER BY pm.id ASC, pmi.image_id ASC
    `);

    await connection.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No product main data found' }, { status: 404 });
    }

    // 🔹 Group by product_main (assuming you only need 1)
    const first = rows[0];
    const product = {
      collection_name: first.collection_name,
      brand_name: first.brand_name,
      link: first.link,
      images: rows.map((r: any) => r.image_url),
    };

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error fetching product main:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product main', details: error.message },
      { status: 500 }
    );
  }
}
