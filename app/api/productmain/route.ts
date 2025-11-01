import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT 
        pm.collection_name,
        b.brand_name,
        pm.link,
        JSON_ARRAYAGG(pmi.image_url) AS images
      FROM product_main pm
      LEFT JOIN brands b ON pm.brand_id = b.brand_id
      LEFT JOIN product_main_images pmi ON pm.id = pmi.product_main_id
      GROUP BY pm.id
      ORDER BY pm.id DESC
    `);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /productmain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
