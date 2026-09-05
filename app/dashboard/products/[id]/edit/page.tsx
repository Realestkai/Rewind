"use client"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
type Product = { id:string; name:string; brand:string; vehicle_type:string; description:string; price_robux:number|null; price_usd:number|null; published:boolean }
export default function EditVehicle({ params }: { params: Promise<{ id:string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [status, setStatus] = useState("")
  useEffect(() => {
    params.then(({ id }) => {
      fetch("/api/dashboard").then(response => response.json()).then(data => {
        setProduct((data.products ?? []).find((item: Product) => item.id === id) ?? null)
      })
    })
  }, [params])
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!product) return
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const response = await fetch("/api/products", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...values, id:product.id, published:values.published === "on", price_robux:Number(values.price_robux) || null, price_usd:Number(values.price_usd) || null }) })
    setStatus(response.ok ? "Changes saved to the live Store." : "Unable to save.")
  }
  if (!product) return <main className="dashboard"><p className="dashboard-message">Loading vehicle…</p></main>
  return <main className="dashboard"><header className="site-header"><Link href="/dashboard/products" className="wordmark">RYVN<span>®</span></Link></header><section className="dashboard-shell"><div className="dashboard-content"><div className="dashboard-title"><div><p className="eyebrow">PRODUCTS</p><h1>Edit vehicle.</h1></div></div><form className="new-product" onSubmit={save}><label>Name<input name="name" defaultValue={product.name}/></label><label>Brand<input name="brand" defaultValue={product.brand}/></label><label>Vehicle type<input name="vehicle_type" defaultValue={product.vehicle_type}/></label><label>Robux price<input name="price_robux" type="number" defaultValue={product.price_robux ?? ""}/></label><label>USD price<input name="price_usd" type="number" step="0.01" defaultValue={product.price_usd ?? ""}/></label><label className="wide">Description<textarea name="description" rows={5} defaultValue={product.description}/></label><label className="check-row wide"><input name="published" type="checkbox" defaultChecked={product.published}/> Show in Store</label><button className="button">Save changes</button>{status && <p>{status}</p>}</form></div></section></main>
}
