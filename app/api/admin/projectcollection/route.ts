import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// ✅ GET: ดึง collections ทั้งหมดของ project
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const project_id = searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json({ error: 'Missing project_id' }, { status: 400 });
    }

    const connection = await getConnection();
    const [rows] = await connection.query(
      `
      SELECT c.collection_id, c.type, c.material_type, c.status
      FROM project_collections pc
      JOIN collections c ON pc.collection_id = c.collection_id
      WHERE pc.project_id = ?
      `,
      [project_id]
    );
    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('GET /projectcollection error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST: อัปเดต collections ของ project
export async function POST(req: Request) {
  try {
    const { project_id, collection_ids } = await req.json();

    if (!project_id || !Array.isArray(collection_ids)) {
      return NextResponse.json({ error: 'Missing project_id or collection_ids' }, { status: 400 });
    }

    const connection = await getConnection();

    // ลบของเก่าออกก่อน
    await connection.query('DELETE FROM project_collections WHERE project_id = ?', [project_id]);

    // เพิ่มของใหม่
    for (const cid of collection_ids) {
      await connection.query(
        'INSERT INTO project_collections (project_id, collection_id) VALUES (?, ?)',
        [project_id, cid]
      );
    }

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /projectcollection error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: ยกเลิกการเชื่อมของ collection เดียว
export async function DELETE(req: Request) {
  try {
    const { project_id, collection_id } = await req.json();

    if (!project_id || !collection_id) {
      return NextResponse.json(
        { error: 'Missing project_id or collection_id' },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    await connection.query(
      'DELETE FROM project_collections WHERE project_id = ? AND collection_id = ?',
      [project_id, collection_id]
    );
    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /projectcollection error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
