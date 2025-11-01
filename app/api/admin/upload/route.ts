import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// 📤 POST — Upload File
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ ตั้งโฟลเดอร์เก็บรูป
    const uploadDir = path.join(process.cwd(), "public", "uploads", "surface");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ ตั้งชื่อไฟล์ใหม่ (UUID)
    const ext = path.extname(file.name);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // ✅ เขียนไฟล์จริงลงในโฟลเดอร์ public/uploads/surface
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // ✅ คืนค่า path (ไม่ต้องมี /public)
    const publicPath = `/uploads/surface/${fileName}`;
    return NextResponse.json({ filePath: publicPath });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
