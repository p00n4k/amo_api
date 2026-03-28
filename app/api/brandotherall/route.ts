import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 🔹 Select all Other-type brands
    const [rows] = await connection.query(`
      SELECT 
        brand_id,
        brand_name,
        main_type,
        type,
        brand_image AS image,
        brand_url
      FROM brands
      WHERE main_type = 'Other'  AND active = 1
      ORDER BY brand_id ASC 
    `);

    await connection.end();

    const result = { brands: rows };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching other brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch other brands', details: error.message },
      { status: 500 }
    );
  }
}
