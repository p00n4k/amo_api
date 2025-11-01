import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // รับไฟล์จาก formdata
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ตั้งชื่อไฟล์ใหม่แบบ unique
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}_${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "brands");
    const filePath = path.join(uploadDir, filename);
    const fileUrl = `/uploads/brands/${filename}`;

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    await writeFile(filePath, buffer);

    // ✅ บันทึกลงฐานข้อมูลทันที
    const connection = await getConnection();
    await connection.query(
      `INSERT INTO brands (brand_name, brand_image, main_type, type, brand_url)
       VALUES (?, ?, ?, ?, ?)`,
      [
        "Uploaded Brand", // หรือจะรับค่าเพิ่มเติมจาก formData ได้
        fileUrl,
        "Surface",
        "Unknown",
        "https://amo.co.th",
      ]
    );

    return NextResponse.json({
      success: true,
      filePath: fileUrl,
      message: "File uploaded and saved to database successfully",
    });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
