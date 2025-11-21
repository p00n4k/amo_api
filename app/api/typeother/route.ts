import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 🔹 Select distinct types for Other brands
    const [rows] = await connection.query(`
      SELECT DISTINCT type
      FROM brands
      WHERE main_type = 'Other'
      AND type IS NOT NULL
      ORDER BY type ASC
    `);

    await connection.end();

    const types = (rows as any[]).map((r) => r.type);

    return NextResponse.json({ types });
  } catch (error: any) {
    console.error('Error fetching other types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch other types', details: error.message },
      { status: 500 }
    );
  }
}
