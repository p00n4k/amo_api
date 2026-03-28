import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 📥 GET — Serve Uploaded Files
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the file path from URL params
    const filePath = params.path.join("/");
    const absolutePath = path.join(process.cwd(), "uploads", filePath);

    console.log("🔍 Looking for file:", absolutePath);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      console.log("❌ File not found:", absolutePath);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();

    // Set appropriate content type
    const contentTypeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
    };

    const contentType = contentTypeMap[ext] || "application/octet-stream";

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("❌ Error serving file:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}