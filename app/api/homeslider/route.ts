import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// GET /api/homeslider
export async function GET() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(`
      SELECT 
        slider_id,
        image_url,
        display_order,
        created_at
      FROM home_sliders
      ORDER BY display_order ASC
    `);

    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching home sliders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home sliders', details: error.message },
      { status: 500 }
    );
  }
}
