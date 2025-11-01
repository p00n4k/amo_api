import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// -------------------------
// 🟢 GET: ดึงภาพทั้งหมด
// -------------------------
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT slider_id, image_url, display_order, created_at
      FROM home_sliders
      ORDER BY display_order ASC
    `);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /homeslider error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// -------------------------
// 🟡 POST: เพิ่มภาพใหม่
// -------------------------
export async function POST(req: Request) {
  try {
    const { image_url, display_order } = await req.json();

    if (!image_url || display_order === undefined)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      INSERT INTO home_sliders (image_url, display_order)
      VALUES (?, ?)
      `,
      [image_url, display_order]
    );
    await connection.end();

    return NextResponse.json({ message: "Home slider added successfully" });
  } catch (error: any) {
    console.error("POST /homeslider error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// -------------------------
// 🟠 PUT: อัปเดตรูปหรือเรียงลำดับ
// -------------------------
export async function PUT(req: Request) {
  try {
    const { slider_id, image_url, display_order } = await req.json();

    if (!slider_id)
      return NextResponse.json({ error: "Missing slider_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      UPDATE home_sliders
      SET image_url = ?, display_order = ?
      WHERE slider_id = ?
      `,
      [image_url, display_order, slider_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Home slider updated successfully" });
  } catch (error: any) {
    console.error("PUT /homeslider error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// -------------------------
// 🔴 DELETE: ลบสไลด์
// -------------------------
export async function DELETE(req: Request) {
  try {
    const { slider_id } = await req.json();

    if (!slider_id)
      return NextResponse.json({ error: "Missing slider_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      DELETE FROM home_sliders WHERE slider_id = ?
      `,
      [slider_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Home slider deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /homeslider error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
