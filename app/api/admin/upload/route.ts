import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    console.log("========== UPLOAD START ==========");

    const formData = await req.formData();

    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "admin";

    console.log("process.cwd():", process.cwd());
    console.log("UPLOAD_DIR env:", process.env.UPLOAD_DIR);
    console.log("folder:", folder);

    if (!file) {
      console.log("❌ No file received");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("file.name:", file.name);
    console.log("file.size:", file.size);

    // OPTION A: force public/uploads
  // ✅ ของใหม่: เอา "public" ออก
  const baseUploadDir =
    process.env.UPLOAD_DIR ||
    path.join(process.cwd(), "uploads"); // ✅ บรรทัดนี้จะทำงานถ้าไม่มี ENV

    console.log("baseUploadDir:", baseUploadDir);

    const uploadDir = path.join(baseUploadDir, folder);

    console.log("uploadDir:", uploadDir);

    if (!fs.existsSync(uploadDir)) {
      console.log("uploadDir does not exist, creating...");
      fs.mkdirSync(uploadDir, { recursive: true });
    } else {
      console.log("uploadDir exists");
    }

    const ext = path.extname(file.name);
    const fileName = `${uuidv4()}${ext}`;

    console.log("generated fileName:", fileName);

    const filePath = path.join(uploadDir, fileName);

    console.log("full filePath:", filePath);

    const buffer = Buffer.from(await file.arrayBuffer());

    fs.writeFileSync(filePath, buffer);

    console.log("✅ File saved successfully");

    const publicPath = `/uploads/${folder}/${fileName}`;

    console.log("publicPath:", publicPath);

    console.log("========== UPLOAD END ==========");

    return NextResponse.json({
      filePath: publicPath,
      savedTo: filePath,
    });

  } catch (error: any) {

    console.error("❌ UPLOAD ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        error: "Upload failed",
        detail: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}