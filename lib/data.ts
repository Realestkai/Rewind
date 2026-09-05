import { neon } from "@neondatabase/serverless"
export type Product = { id: string; slug: string; brand: string; name: string; price_robux: number | null; price_usd: number | null; vehicle_type: string; preview_label: string | null; description: string; features: string[]; hero_image_url: string | null; youtube_url: string | null; collage_urls: string[]; model_url: string | null; published: boolean }
const connectionString = process.env.DATABASE_URL
export const dataConfigured = Boolean(connectionString)
function db() { if (!connectionString) throw new Error("DATABASE_URL is not configured"); return neon(connectionString) }
export async function listPublishedProducts(): Promise<Product[]> { if (!dataConfigured) return []; return db()`select id, slug, brand, name, price_robux, price_usd, vehicle_type, preview_label, description, features, hero_image_url, youtube_url, collage_urls, model_url, published from products where published = true order by created_at desc` as Promise<Product[]> }
export async function productBySlug(slug: string): Promise<Product | null> { if (!dataConfigured) return null; const rows = await db()`select id, slug, brand, name, price_robux, price_usd, vehicle_type, preview_label, description, features, hero_image_url, youtube_url, collage_urls, model_url, published from products where slug = ${slug} and published = true limit 1` as Product[]; return rows[0] ?? null }
export async function createProduct(product: Omit<Product, "id">) { const rows = await db()`insert into products (slug, brand, name, price_robux, price_usd, vehicle_type, preview_label, description, features, hero_image_url, youtube_url, collage_urls, model_url, published) values (${product.slug}, ${product.brand}, ${product.name}, ${product.price_robux}, ${product.price_usd}, ${product.vehicle_type}, ${product.preview_label}, ${product.description}, ${JSON.stringify(product.features)}::jsonb, ${product.hero_image_url}, ${product.youtube_url}, ${JSON.stringify(product.collage_urls)}::jsonb, ${product.model_url}, ${product.published}) returning *` as Product[]; return rows }
export async function upsertUser(user: { id: string; username: string; avatarUrl?: string | null }) {
  if (!dataConfigured) return
  await db()`insert into users (id, username, avatar_url) values (${user.id}, ${user.username}, ${user.avatarUrl ?? null}) on conflict (id) do update set username = excluded.username, avatar_url = excluded.avatar_url`
}
export type UserRecord = { id: string; username: string; avatar_url: string | null; role: "customer" | "editor" | "owner" }
export async function userById(id: string): Promise<UserRecord | null> { if (!dataConfigured) return null; const rows = await db()`select id, username, avatar_url, role from users where id = ${id} limit 1` as UserRecord[]; return rows[0] ?? null }
export async function setUserRole(id: string, role: UserRecord["role"]) { if (!dataConfigured) return; await db()`update users set role = ${role} where id = ${id}` }
export async function dashboardSummary() { if (!dataConfigured) return { products: 0, commissions: 0, users: 0 }; const [products] = await db()`select count(*)::int as count from products` as { count: number }[]; const [commissions] = await db()`select count(*)::int as count from commissions where status in ('open', 'in_progress')` as { count: number }[]; const [users] = await db()`select count(*)::int as count from users where role in ('owner', 'editor')` as { count: number }[]; return { products: products?.count ?? 0, commissions: commissions?.count ?? 0, users: users?.count ?? 0 } }
export async function listAdminProducts(): Promise<Product[]> { if (!dataConfigured) return []; return db()`select id, slug, brand, name, price_robux, price_usd, vehicle_type, preview_label, description, features, hero_image_url, youtube_url, collage_urls, model_url, published from products order by created_at desc` as Promise<Product[]> }
export async function updateProduct(id: string, input: Partial<Product>) { const rows = await db()`update products set name = coalesce(${input.name ?? null}, name), brand = coalesce(${input.brand ?? null}, brand), vehicle_type = coalesce(${input.vehicle_type ?? null}, vehicle_type), description = coalesce(${input.description ?? null}, description), hero_image_url = coalesce(${input.hero_image_url ?? null}, hero_image_url), price_robux = coalesce(${input.price_robux ?? null}, price_robux), price_usd = coalesce(${input.price_usd ?? null}, price_usd), published = coalesce(${input.published ?? null}, published) where id = ${id} returning *` as Product[]; return rows[0] ?? null }
export async function deleteProduct(id: string) { await db()`delete from products where id = ${id}` }
export async function commissionProductId(slug?: string | null) {
  if (!slug || !dataConfigured) return null
  const rows = await db()`select id from products where slug = ${slug} limit 1` as { id: string }[]
  return rows[0]?.id ?? null
}
export async function createCommission(input: { userId: string; productId: string | null; requestTypes: string[]; details: string; attachmentUrl?: string | null; channelId?: string | null }) {
  const rows = await db()`insert into commissions (user_id, product_id, request_type, details, attachment_url, discord_channel_id) values (${input.userId}, ${input.productId}, ${input.requestTypes}, ${input.details}, ${input.attachmentUrl ?? null}, ${input.channelId ?? null}) returning id, status, created_at` as { id: string; status: string; created_at: string }[]
  return rows[0]
}
export type Review = { id: string; rating: number; body: string; username: string; avatar_url: string | null }
export async function approvedReviews(productId: string): Promise<Review[]> {
  if (!dataConfigured) return []
  return db()`select reviews.id, reviews.rating, reviews.body, users.username, users.avatar_url from reviews join users on users.id = reviews.user_id where reviews.product_id = ${productId} and reviews.approved = true order by reviews.created_at desc` as Promise<Review[]>
}
