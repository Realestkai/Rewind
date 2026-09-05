"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Package, Ticket, Users } from "lucide-react"
type Data = { user?: { username:string }; summary?: { products:number; commissions:number; users:number }; error?:string }
export default function DashboardPage() {
  const [data, setData] = useState<Data | null>(null)
  useEffect(() => { fetch("/api/dashboard").then(response => response.json()).then(setData) }, [])
  if (!data) return <main className="dashboard"><p className="dashboard-message">Loading secure dashboard…</p></main>
  if (data.error || !data.user || !data.summary) return <main className="dashboard"><header className="site-header"><Link href="/" className="wordmark">RYVN<span>®</span></Link></header><section className="dashboard-empty"><p className="eyebrow">RESTRICTED</p><h1>Staff access required.</h1><p>Only Discord Owner and Staff accounts can open this workspace.</p><Link className="button" href="/profile">Open profile</Link></section></main>
  return <main className="dashboard"><header className="site-header"><Link href="/" className="wordmark">RYVN<span>®</span></Link><Link className="quiet-link" href="/profile">{data.user.username}</Link></header><section className="dashboard-shell"><aside className="dashboard-nav"><p className="eyebrow">RYVN ADMIN</p><strong>Command centre</strong><Link href="/store">Store</Link><Link href="/commissions">Commissions</Link><Link href="/settings">Settings</Link></aside><div className="dashboard-content"><div className="dashboard-title"><div><p className="eyebrow">STAFF DASHBOARD</p><h1>Marketplace control.</h1><p>Manage every live listing and commission from one protected workspace.</p></div><Link className="button" href="/store">View Store</Link></div><section className="stats"><article><Package/><strong>{data.summary.products}</strong><span>Products</span></article><article><Ticket/><strong>{data.summary.commissions}</strong><span>Open tickets</span></article><article><Users/><strong>{data.summary.users}</strong><span>Staff accounts</span></article></section><section className="product-manager"><p className="eyebrow">PRODUCT MANAGEMENT</p><h2>Upload and delivery tools</h2><p>Railway Bucket storage is configured for the protected upload and download implementation.</p></section></div></section></main>
}
