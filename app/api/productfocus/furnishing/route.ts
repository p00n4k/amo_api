import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

type ProductFocusRow = RowDataPacket & {
  collection_name: string;
  brand_name: string;
  brand_image: string;
  description: string;
  made_in: string;
  type: string;
  link: string;
  image_url: string | null; // LEFT JOIN อาจเป็น null
};

export async function GET() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute<ProductFocusRow[]>(`
      SELECT 
        pf.collection_name,
        b.brand_name,
        b.brand_image,
        pf.description,
        pf.made_in,
        pf.type,
        pf.link,
        pfi.image_url
      FROM product_focus pf
      LEFT JOIN brands b ON pf.brand_id = b.brand_id
      LEFT JOIN product_focus_images pfi ON pf.focus_id = pfi.focus_id
      WHERE pf.type = 'Furnishing'
      ORDER BY pf.focus_id, pfi.display_order ASC
    `);

    await connection.end();

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No furnishing found" }, { status: 404 });
    }

    const item = {
      collection_name: rows[0].collection_name,
      brand_name: rows[0].brand_name,
      brand_image: rows[0].brand_image,
      description: rows[0].description,
      made_in: rows[0].made_in,
      type: rows[0].type,
      link: rows[0].link,
      images: rows
        .map((r) => r.image_url)
        .filter((u): u is string => Boolean(u)),
    };

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
