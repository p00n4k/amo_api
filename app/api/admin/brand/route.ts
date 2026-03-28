import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

type BrandPayload = {
  brand_id?: number;
  brand_name?: string;
  brand_image?: string;
  main_type?: string;
  type?: string;
  brand_url?: string;
  active?: number | boolean;
};

function toActive01(v: any): number | undefined {
  if (v === undefined) return undefined;
  if (v === null) return undefined;
  if (typeof v === 'boolean') return v ? 1 : 0;
  const n = Number(v);
  if (Number.isNaN(n)) return undefined;
  return n ? 1 : 0;
}

export async function GET() {
  let connection: any;
  try {
    connection = await getConnection();

    // ✅ Include active (if your column name differs, change here)
    const [rows] = await connection.query(
      `
      SELECT
        brand_id,
        brand_name,
        brand_image,
        main_type,
        type,
        brand_url,
        active
      FROM brands
      ORDER BY brand_id DESC
      `
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('GET /api/admin/brand error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands', details: error.message },
      { status: 500 }
    );
  } finally {
    try {
      await connection?.end?.();
    } catch {}
  }
}

export async function POST(req: Request) {
  let connection: any;
  try {
    const body = (await req.json()) as BrandPayload;

    const brand_name = (body.brand_name || '').trim();
    const brand_image = (body.brand_image || '').trim();
    const main_type = (body.main_type || '').trim();
    const type = (body.type || '').trim();
    const brand_url = (body.brand_url || '').trim();
    const active = toActive01(body.active) ?? 1; // ✅ default active = 1

    if (!brand_name || !brand_image || !main_type || !type || !brand_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    const [result] = await connection.query(
      `
      INSERT INTO brands
        (brand_name, brand_image, main_type, type, brand_url, active)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [brand_name, brand_image, main_type, type, brand_url, active]
    );

    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    console.error('POST /api/admin/brand error:', error);
    return NextResponse.json(
      { error: 'Failed to create brand', details: error.message },
      { status: 500 }
    );
  } finally {
    try {
      await connection?.end?.();
    } catch {}
  }
}

export async function PUT(req: Request) {
  let connection: any;
  try {
    const body = (await req.json()) as BrandPayload;

    const brand_id = Number(body.brand_id);
    if (!brand_id || Number.isNaN(brand_id)) {
      return NextResponse.json({ error: 'brand_id is required' }, { status: 400 });
    }

    // ✅ Build dynamic update fields (allows partial update, including only active)
    const fields: string[] = [];
    const values: any[] = [];

    if (body.brand_name !== undefined) {
      fields.push('brand_name = ?');
      values.push(String(body.brand_name).trim());
    }
    if (body.brand_image !== undefined) {
      fields.push('brand_image = ?');
      values.push(String(body.brand_image).trim());
    }
    if (body.main_type !== undefined) {
      fields.push('main_type = ?');
      values.push(String(body.main_type).trim());
    }
    if (body.type !== undefined) {
      fields.push('type = ?');
      values.push(String(body.type).trim());
    }
    if (body.brand_url !== undefined) {
      fields.push('brand_url = ?');
      values.push(String(body.brand_url).trim());
    }
    if (body.active !== undefined) {
      const a = toActive01(body.active);
      if (a === undefined) {
        return NextResponse.json({ error: 'active must be 0/1 or boolean' }, { status: 400 });
      }
      fields.push('active = ?');
      values.push(a);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    values.push(brand_id);

    const [result] = await connection.query(
      `
      UPDATE brands
      SET ${fields.join(', ')}
      WHERE brand_id = ?
      `,
      values
    );

    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    console.error('PUT /api/admin/brand error:', error);
    return NextResponse.json(
      { error: 'Failed to update brand', details: error.message },
      { status: 500 }
    );
  } finally {
    try {
      await connection?.end?.();
    } catch {}
  }
}

export async function DELETE(req: Request) {
  let connection: any;
  try {
    const body = (await req.json()) as { brand_id?: number };
    const brand_id = Number(body.brand_id);

    if (!brand_id || Number.isNaN(brand_id)) {
      return NextResponse.json({ error: 'brand_id is required' }, { status: 400 });
    }

    connection = await getConnection();

    const [result] = await connection.query(
      `DELETE FROM brands WHERE brand_id = ?`,
      [brand_id]
    );

    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    console.error('DELETE /api/admin/brand error:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand', details: error.message },
      { status: 500 }
    );
  } finally {
    try {
      await connection?.end?.();
    } catch {}
  }
}