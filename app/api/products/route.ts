import { NextResponse } from "next/server"
import { createProduct, dataConfigured, listPublishedProducts } from "@/lib/data"

export const dynamic = "force-dynamic"
export async function GET() {
  if (!dataConfigured) return NextResponse.json({ products: [], configured: false })
  return NextResponse.json({ products: await listPublishedProducts(), configured: true })
}
export async function POST(request: Request) {
  const key = request.headers.get("x-ryvn-admin-key")
  if (!process.env.RYVN_ADMIN_API_KEY || key !== process.env.RYVN_ADMIN_API_KEY) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()
  const required = ["slug", "brand", "name", "vehicle_type", "description"]
  if (!required.every((field) => typeof body[field] === "string" && body[field].trim())) return NextResponse.json({ error: "Missing product fields" }, { status: 400 })
  const products = await createProduct({ ...body, features: Array.isArray(body.features) ? body.features : [], collage_urls: Array.isArray(body.collage_urls) ? body.collage_urls : [] })
  return NextResponse.json({ product: products[0] }, { status: 201 })
}
