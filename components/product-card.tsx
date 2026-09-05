"use client"

import Link from "next/link"
import { ArrowUpRight, Eye, X } from "lucide-react"
import { useState } from "react"
import type { Product } from "@/lib/data"
import { ProductViewer360 } from "./product-viewer-360"

function price(product: Product) { return product.price_usd ? `$${Number(product.price_usd).toFixed(2)}` : product.price_robux ? `${product.price_robux.toLocaleString()} R$` : "Price on request" }
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [open, setOpen] = useState(false)
  const images = product.collage_urls?.filter(Boolean) ?? []
  return <article className="market-card">
    <ProductViewer360 compact priority={priority} name={product.name} image={product.hero_image_url} images={images} />
    <div className="market-card-top"><span>{product.brand}</span><span>{product.preview_label ?? product.vehicle_type}</span></div>
    <div className="market-card-main"><div><h3>{product.name}</h3><p>{product.vehicle_type} · {product.features?.slice(0, 2).join(" · ") || "Roblox-ready asset"}</p></div><strong>{price(product)}</strong></div>
    <div className="market-card-actions"><button onClick={() => setOpen(true)} aria-haspopup="dialog"><Eye size={16} /> Quick view</button><Link href={`/products/${product.slug}`}>View model <ArrowUpRight size={16} /></Link></div>
    {open && <div className="quick-view-backdrop" role="presentation" onMouseDown={() => setOpen(false)}><section className="quick-view" role="dialog" aria-modal="true" aria-labelledby={`quick-${product.id}`} onMouseDown={event => event.stopPropagation()}><button className="quick-close" onClick={() => setOpen(false)} aria-label="Close quick view"><X size={19} /></button><ProductViewer360 name={product.name} image={product.hero_image_url} images={images} /><div><p className="eyebrow">{product.brand} · {product.vehicle_type}</p><h2 id={`quick-${product.id}`}>{product.name}</h2><p>{product.description}</p><strong className="quick-price">{price(product)}</strong><Link className="button" href={`/products/${product.slug}`}>View full details <ArrowUpRight size={16} /></Link></div></section></div>}
  </article>
}
