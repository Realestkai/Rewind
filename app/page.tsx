"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Check, Eye, Menu, Play, ShieldCheck, SlidersHorizontal, X } from "lucide-react"
import { brands, products } from "@/lib/catalog"

export default function Home() {
  const [brand, setBrand] = useState("All vehicles")
  const [menuOpen, setMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const shown = brand === "All vehicles" ? products : products.filter((product) => product.brand === brand)
  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast ? "high" : "normal"
    document.documentElement.dataset.motion = reduceMotion ? "reduce" : "normal"
    document.documentElement.style.fontSize = compact ? "112.5%" : "100%"
  }, [compact, highContrast, reduceMotion])

  return <main>
    <a className="skip-link" href="#catalog">Skip to catalog</a>
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="RYVN home">RYVN<span>®</span></Link>
      <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
        <a href="#catalog" onClick={() => setMenuOpen(false)}>Catalog</a><Link href="/commissions">Commissions</Link><Link href="/accessibility">Accessibility</Link><Link href="/dashboard">Dashboard</Link>
      </nav>
      <div className="header-actions"><Link className="quiet-link" href="/profile">Profile</Link><Link className="button button-small" href="/login">Sign in with Discord</Link><button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
    </header>
    <section className="hero" aria-labelledby="hero-title"><div className="hero-glow" /><p className="eyebrow">ROBLOX VEHICLE MARKETPLACE</p><h1 id="hero-title">Built to be<br /><em>driven.</em></h1><p className="hero-copy">Premium vehicles, properly prepared for your game. Browse the catalog, inspect every angle, and commission the details that make a car yours.</p><div className="hero-actions"><a className="button" href="#catalog">Explore catalog <ArrowRight size={16} /></a><Link className="button button-ghost" href="/commissions">Start a commission</Link></div><div className="hero-specs"><span><Check size={14} /> Vehicle previews</span><span><Check size={14} /> Roblox-ready delivery</span><span><Check size={14} /> Custom commissions</span></div></section>
    <section className="preview-strip"><div><Play size={17} /><div><p className="eyebrow">SEE IT FIRST</p><strong>Video and carousel previews</strong></div></div><p>Each catalog release can include a YouTube walkaround, image collage, and interactive 360° preview before you buy.</p><a href="#catalog">Browse releases <ArrowRight size={16} /></a></section>
    <section id="catalog" className="catalog" aria-labelledby="catalog-title"><div className="catalog-heading"><div><p className="eyebrow">THE CATALOG</p><h2 id="catalog-title">Find your next build.</h2></div><p>Choose a marque on the left. The vehicle collection scrolls independently, so the catalog stays quick as it grows.</p></div><div className="catalog-layout"><aside className="brand-rail" aria-label="Vehicle brands"><p className="rail-label">BRANDS</p>{brands.map((item) => <button key={item} onClick={() => setBrand(item)} className={brand === item ? "brand active" : "brand"}>{item}</button>)}<Link className="commission-prompt" href="/commissions"><span>Need something specific?</span> Commission a vehicle <ArrowRight size={15} /></Link></aside><div className="product-scroll" aria-live="polite">{shown.map((product, index) => <article className="product-card" key={product.slug}><div className={"vehicle-art art-" + index % 3}><span className="art-number">{String(index + 1).padStart(2, "0")}</span><div className="car-silhouette" /><span>{product.preview}</span></div><div className="product-info"><div><p>{product.brand}</p><h3>{product.name}</h3></div><span className="format">{product.format}</span></div><div className="product-footer"><span>{product.price}</span><Link href={"/products/" + product.slug}>View vehicle <ArrowRight size={16} /></Link></div></article>)}</div></div></section>
    <section className="commission-banner"><div><p className="eyebrow">BEYOND THE CATALOG</p><h2>Make the vehicle<br /><em>your own.</em></h2></div><div className="commission-copy"><p>Choose a vehicle, tell us what needs changing, attach a badge or emblem, and keep every detail in one tracked request.</p><Link className="button" href="/commissions">Commission an edit <ArrowRight size={16} /></Link></div></section>
    <section className="trust-grid"><div><ShieldCheck size={19} /><h3>Clear scope</h3><p>Each listing says exactly what is included and what can be commissioned.</p></div><div><Eye size={19} /><h3>Preview before purchase</h3><p>Use video, collage and 360° references to make an informed decision.</p></div><div><SlidersHorizontal size={19} /><h3>Your settings</h3><p>Adjust type size, contrast and motion controls whenever you need them.</p></div></section>
    <div className="accessibility-dock" aria-label="Accessibility display settings"><button onClick={() => setCompact(!compact)} aria-pressed={compact}>A<span>A</span></button><button onClick={() => setHighContrast(!highContrast)} aria-pressed={highContrast}>Contrast</button><button onClick={() => setReduceMotion(!reduceMotion)} aria-pressed={reduceMotion}>Motion</button></div>
    <footer><Link className="wordmark" href="/">RYVN<span>®</span></Link><p>Vehicles for worlds in motion.</p><div><Link href="/accessibility">Accessibility</Link><Link href="/settings">Settings</Link><Link href="/login">Discord sign in</Link></div><small>© 2026 RYVN. All rights reserved.</small></footer>
  </main>
}
