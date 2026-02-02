import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// helper: ส่ง error แบบอ่านง่าย (ชั่วคราวไว้ debug)
function errorJson(error: any, fallbackMsg: string) {
  return NextResponse.json(
    {
      error: fallbackMsg,
      message: error?.message,
      code: error?.code,
      sqlMessage: error?.sqlMessage,
      sqlState: error?.sqlState,
      errno: error?.errno,
    },
    { status: 500 }
  );
}

// GET /api/admin/homeslider  -> ดึงทั้งหมด (ไม่จำกัด)
export async function GET() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(`
      SELECT slider_id, image_url, display_order, created_at
      FROM home_sliders
      ORDER BY display_order ASC
    `);

    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /api/admin/homeslider error:", error);
    return errorJson(error, "Failed to fetch home sliders");
  }
}

// POST /api/admin/homeslider  -> สร้างใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const image_url = body?.image_url;
    const display_order = body?.display_order;

    if (!image_url || typeof image_url !== "string") {
      return NextResponse.json({ error: "image_url is required" }, { status: 400 });
    }
    if (display_order == null || Number.isNaN(Number(display_order))) {
      return NextResponse.json({ error: "display_order is required" }, { status: 400 });
    }

    const connection = await getConnection();

    // ✅ (ตัวเลือก) กัน display_order ซ้ำ หาก DB ตั้ง unique ไว้
    // ถ้าคุณไม่ต้องการกัน ให้ลบ block นี้ได้
    const [dup] = await connection.execute(
      `SELECT slider_id FROM home_sliders WHERE display_order = ? LIMIT 1`,
      [display_order]
    );
    if ((dup as any[]).length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: "display_order already exists" },
        { status: 409 }
      );
    }

    const [result] = await connection.execute(
      `INSERT INTO home_sliders (image_url, display_order) VALUES (?, ?)`,
      [image_url, Number(display_order)]
    );

    await connection.end();
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    console.error("POST /api/admin/homeslider error:", error);
    return errorJson(error, "Failed to create slider");
  }
}

// PUT /api/admin/homeslider  -> แก้ไข
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const slider_id = body?.slider_id;
    const image_url = body?.image_url;
    const display_order = body?.display_order;

    if (!slider_id) {
      return NextResponse.json({ error: "slider_id is required" }, { status: 400 });
    }

    const connection = await getConnection();

    // อัปเดตเฉพาะฟิลด์ที่ส่งมา
    const updates: string[] = [];
    const params: any[] = [];

    if (image_url != null) {
      updates.push("image_url = ?");
      params.push(image_url);
    }
    if (display_order != null) {
      updates.push("display_order = ?");
      params.push(Number(display_order));
    }

    if (updates.length === 0) {
      await connection.end();
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    params.push(slider_id);

    const [result] = await connection.execute(
      `UPDATE home_sliders SET ${updates.join(", ")} WHERE slider_id = ?`,
      params
    );

    await connection.end();
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    console.error("PUT /api/admin/homeslider error:", error);
    return errorJson(error, "Failed to update slider");
  }
}

// DELETE /api/admin/homeslider  -> ลบ
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const slider_id = body?.slider_id;

    if (!slider_id) {
      return NextResponse.json({ error: "slider_id is required" }, { status: 400 });
    }

    const connection = await getConnection();

    const [result] = await connection.execute(
      `DELETE FROM home_sliders WHERE slider_id = ?`,
      [slider_id]
    );

    await connection.end();
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    console.error("DELETE /api/admin/homeslider error:", error);
    return errorJson(error, "Failed to delete slider");
  }
}
