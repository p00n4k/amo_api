import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 🔹 Select all product surface items
    const [rows] = await connection.execute(`
      SELECT 
        image AS image,
        link AS link
      FROM product_surface_items
      ORDER BY item_id ASC
    `);

    await connection.end();

    // 🔹 Format response
    const result = {
      items: rows.map((r: any) => ({
        image: r.image,
        link: r.link,
      })),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching product surface items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product surface items', details: error.message },
      { status: 500 }
    );
  }
}
