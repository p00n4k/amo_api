import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 🔹 Fetch last 4 projects sorted by latest update date
    const [rows] = await connection.execute(`
      SELECT 
        project_id,
        project_name,
        data_update,
        project_category
      FROM projects
      ORDER BY data_update DESC
      LIMIT 4
    `);

    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching latest projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest projects', details: error.message },
      { status: 500 }
    );
  }
}
