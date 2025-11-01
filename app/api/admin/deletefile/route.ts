import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { path: filePath } = await req.json();

    if (!filePath || !filePath.startsWith("/uploads/")) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // แปลง path จาก URL เป็น path จริงในเครื่อง
    const absolutePath = path.join(process.cwd(), "public", filePath);

    // ตรวจสอบว่ามีไฟล์อยู่จริงไหม
    try {
      await fs.access(absolutePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await fs.unlink(absolutePath);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error: any) {
    console.error("DELETE FILE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
