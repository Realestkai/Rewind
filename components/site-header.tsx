"use client"

import Link from "next/link"
import { Menu, Search, ShoppingBag, X } from "lucide-react"
import { useEffect, useState } from "react"

type Session = { username: string } | null

export function SiteHeader({ active }: { active?: "home" | "shop" | "commissions" }) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<Session>(null)
  useEffect(() => { fetch("/api/session").then(r => r.json()).then(d => setUser(d.user ?? null)).catch(() => undefined) }, [])
  const close = () => setOpen(false)
  return <header className="store-header">
    <Link href="/" className="brand-mark" aria-label="RYVN home">RYVN<sup>®</sup></Link>
    <nav className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Main navigation">
      <Link className={active === "home" ? "is-active" : ""} href="/" onClick={close}>Home</Link>
      <Link className={active === "shop" ? "is-active" : ""} href="/store" onClick={close}>Shop</Link>
      <Link className={active === "commissions" ? "is-active" : ""} href="/commissions" onClick={close}>Commissions</Link>
      <Link href="/accessibility" onClick={close}>Accessibility</Link>
    </nav>
    <div className="header-tools">
      <Link className="header-icon" href="/store" aria-label="Search the catalog"><Search size={18} /></Link>
      <Link className="header-icon" href="/profile" aria-label="Your account"><ShoppingBag size={18} /></Link>
      <Link className="account-link" href={user ? "/profile" : "/login"}>{user ? user.username : "Sign in"}</Link>
      <button className="mobile-nav-toggle" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
  </header>
}
