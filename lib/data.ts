export type Product = { id: string; slug: string; brand: string; name: string; price_robux: number | null; price_usd: number | null; vehicle_type: string; preview_label: string | null; description: string; features: string[]; hero_image_url: string | null; youtube_url: string | null; collage_urls: string[]; model_url: string | null; published: boolean }

const baseUrl = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const dataConfigured = Boolean(baseUrl && serviceKey)

async function request(path: string, init?: RequestInit) {
  if (!baseUrl || !serviceKey) throw new Error("RYVN data is not configured")
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, { ...init, headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json", ...(init?.headers ?? {}) }, cache: "no-store" })
  if (!response.ok) throw new Error(`Data request failed: ${response.status}`)
  return response.status === 204 ? null : response.json()
}

export async function listPublishedProducts(): Promise<Product[]> {
  if (!dataConfigured) return []
  return request("products?select=*&published=eq.true&order=created_at.desc") as Promise<Product[]>
}
export async function productBySlug(slug: string): Promise<Product | null> {
  if (!dataConfigured) return null
  const result = await request(`products?select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`) as Product[]
  return result[0] ?? null
}
export async function createProduct(product: Omit<Product, "id" | "published">) {
  return request("products", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ ...product, published: false }) }) as Promise<Product[]>
}
