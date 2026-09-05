import { NextRequest, NextResponse } from "next/server"
import { createProduct, dataConfigured, deleteProduct, listPublishedProducts, updateProduct, userById } from "@/lib/data"
import { readSession } from "@/lib/auth"

export const dynamic = "force-dynamic"
export async function GET() {
  if (!dataConfigured) return NextResponse.json({ products: [], configured: false })
  return NextResponse.json({ products: await listPublishedProducts(), configured: true })
}
export async function POST(request: NextRequest) {
  const session = readSession(request.cookies.get("ryvn_discord_user")?.value)
  const account = session ? await userById(session.id) : null
  if (!session) return NextResponse.json({ error: "Sign in with Discord to publish a product." }, { status: 401 })
  if (!account || !["owner", "editor"].includes(account.role)) return NextResponse.json({ error: "Your Discord account does not have publishing access." }, { status: 403 })
  const body = await request.json()
  const required = ["slug", "brand", "name", "vehicle_type", "description"]
  if (!required.every((field) => typeof body[field] === "string" && body[field].trim())) return NextResponse.json({ error: "Missing product fields" }, { status: 400 })
  const products = await createProduct({ ...body, price_robux: Number.isFinite(Number(body.price_robux)) ? Number(body.price_robux) : null, price_usd: Number.isFinite(Number(body.price_usd)) ? Number(body.price_usd) : null, preview_label: body.preview_label || null, hero_image_url: body.hero_image_url || null, youtube_url: body.youtube_url || null, model_url: body.model_url || null, published: Boolean(body.published), features: Array.isArray(body.features) ? body.features : [], collage_urls: Array.isArray(body.collage_urls) ? body.collage_urls : [] })
  return NextResponse.json({ product: products[0] }, { status: 201 })
}
async function staff(request: NextRequest) { const session = readSession(request.cookies.get("ryvn_discord_user")?.value); const account = session ? await userById(session.id) : null; return account && ["owner", "editor"].includes(account.role) ? account : null }
export async function PATCH(request: NextRequest) { if (!await staff(request)) return NextResponse.json({ error: "Staff access required." }, { status: 403 }); const body = await request.json(); if (!body.id) return NextResponse.json({ error: "Product id required." }, { status: 400 }); return NextResponse.json({ product: await updateProduct(body.id, body) }) }
export async function DELETE(request: NextRequest) { if (!await staff(request)) return NextResponse.json({ error: "Staff access required." }, { status: 403 }); const id = request.nextUrl.searchParams.get("id"); if (!id) return NextResponse.json({ error: "Product id required." }, { status: 400 }); await deleteProduct(id); return NextResponse.json({ ok: true }) }
