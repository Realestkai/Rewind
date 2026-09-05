export const brands = ["All vehicles", "BMW", "Porsche", "Mercedes-Benz", "Audi", "Lamborghini", "McLaren"]
export type LegacyProduct = { slug: string; brand: string; name: string; price: string; format: string; preview: string; description: string; features: string[] }
export const products: LegacyProduct[] = []
export function getProduct(slug: string) { return products.find((product) => product.slug === slug) }
