import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟡 POST — เชื่อม Project ↔ Collection
export async function POST(req: Request) {
  try {
    const { project_id, collection_id } = await req.json();

    if (!project_id || !collection_id)
      return NextResponse.json(
        { error: "Missing project_id or collection_id" },
        { status: 400 }
      );

    const connection = await getConnection();

    // ✅ ป้องกันการเพิ่มซ้ำ (unique)
    const [exists]: any = await connection.query(
      `
      SELECT * FROM project_collections
      WHERE project_id = ? AND collection_id = ?
      `,
      [project_id, collection_id]
    );

    if (exists.length > 0) {
      await connection.end();
      return NextResponse.json({
        message: "This project is already linked to the collection.",
      });
    }

    await connection.execute(
      `
      INSERT INTO project_collections (project_id, collection_id)
      VALUES (?, ?)
      `,
      [project_id, collection_id]
    );

    await connection.end();
    return NextResponse.json({ message: "Project linked to collection successfully" });
  } catch (error: any) {
    console.error("POST /projectcollection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE — ยกเลิกการเชื่อม
export async function DELETE(req: Request) {
  try {
    const { project_id, collection_id } = await req.json();

    if (!project_id || !collection_id)
      return NextResponse.json(
        { error: "Missing project_id or collection_id" },
        { status: 400 }
      );

    const connection = await getConnection();
    await connection.execute(
      `
      DELETE FROM project_collections
      WHERE project_id = ? AND collection_id = ?
      `,
      [project_id, collection_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Project-Collection link removed successfully" });
  } catch (error: any) {
    console.error("DELETE /projectcollection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
