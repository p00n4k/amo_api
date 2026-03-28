import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // ?type=Wood

    const connection = await getConnection();

    let query = `
      SELECT 
        brand_id,
        brand_name,
        main_type,
        type,
        brand_image AS image,
        brand_url
      FROM brands
      WHERE main_type = 'Furnishing' AND active = 1;
    `;

    if (type) {
      query += ` AND type = ? ORDER BY brand_id ASC`;
    } else {
      query += ` ORDER BY brand_id ASC`;
    }

    const [rows] = type
      ? await connection.execute(query, [type])
      : await connection.query(query);

    await connection.end();

    return NextResponse.json({ brands: rows });
  } catch (error: any) {
    console.error('Error fetching furnishing brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch furnishing brands', details: error.message },
      { status: 500 }
    );
  }
}
