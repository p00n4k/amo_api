import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// 📤 POST — Upload File
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string; // ✅ รับค่า folder (surface, furnishing, focus, etc.)

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ กำหนด subfolder (default = surface)
    const subFolder = folder || "surface";
    
    // ✅ ตั้งโฟลเดอร์เก็บรูป
    const uploadDir = path.join(process.cwd(), "public", "uploads", subFolder);
    
    // ✅ สร้างโฟลเดอร์ถ้ายังไม่มี
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ ตั้งชื่อไฟล์ใหม่ (UUID)
    const ext = path.extname(file.name);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // ✅ เขียนไฟล์จริงลงในโฟลเดอร์
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // ✅ คืนค่า path (ไม่ต้องมี /public)
    const publicPath = `/uploads/${subFolder}/${fileName}`;
    
    console.log("✅ File uploaded:", publicPath);
    
    return NextResponse.json({ filePath: publicPath });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}