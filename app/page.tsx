"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Accessibility, ArrowRight, Check, Contrast, Eye, Menu, Play, RotateCcw, ShieldCheck, SlidersHorizontal, Volume2, X } from "lucide-react"

export default function Home() {
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fontScale, setFontScale] = useState(0)
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [showcase, setShowcase] = useState<"bmw" | "bike">("bmw")
  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast ? "high" : "normal"
    document.documentElement.dataset.motion = reduceMotion ? "reduce" : "normal"
    document.documentElement.style.fontSize = fontScale === 0 ? "100%" : fontScale === 1 ? "112.5%" : "125%"
  }, [fontScale, highContrast, reduceMotion])
  useEffect(() => { fetch("/api/session").then(response => response.json()).then(data => setUser(data.user ?? null)).catch(() => setUser(null)) }, [])

  return <main id="main-content">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="RYVN home">RYVN<span>®</span></Link>
      <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
        <Link href="/store" onClick={() => setMenuOpen(false)}>Store</Link><Link href="/commissions">Commissions</Link><Link href="/accessibility">Accessibility</Link>
      </nav>
      <div className="header-actions"><Link className="quiet-link" href="/profile">{user ? user.username : "Profile"}</Link>{!user && <Link className="button button-small" href="/login">Sign in with Discord</Link>}<button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
    </header>
    <section className="hero" aria-labelledby="hero-title"><div className="hero-glow" /><div className="hero-showcase"><Image className={showcase === "bmw" ? "showcase-image active" : "showcase-image"} src="/showcase/ryvn-bmw-showcase.jpg" alt="Purple BMW coupe showcased at a night-time gas station" fill priority sizes="(max-width: 760px) 90vw, 48vw" /><Image className={showcase === "bike" ? "showcase-image active" : "showcase-image"} src="/showcase/ryvn-bike-showcase.png" alt="Blue sport motorcycle on a studio road surface" fill sizes="(max-width: 760px) 90vw, 48vw" /><div className="showcase-collage" role="group" aria-label="Choose showcase vehicle"><button className={showcase === "bmw" ? "showcase-tile active" : "showcase-tile"} onClick={() => setShowcase("bmw")} aria-label="Show BMW showcase" aria-pressed={showcase === "bmw"}><Image src="/showcase/ryvn-bmw-showcase.jpg" alt="" fill sizes="120px" /></button><button className={showcase === "bike" ? "showcase-tile active" : "showcase-tile"} onClick={() => setShowcase("bike")} aria-label="Show sport bike showcase" aria-pressed={showcase === "bike"}><Image src="/showcase/ryvn-bike-showcase.png" alt="" fill sizes="120px" /></button></div></div><p className="eyebrow">ROBLOX VEHICLE MARKETPLACE</p><h1 id="hero-title">Built to be<br /><em>driven.</em></h1><p className="hero-copy">Premium vehicles, properly prepared for your game. Browse the catalog, inspect every angle, and commission the details that make a car yours.</p><div className="hero-actions"><a className="button" href="/store">Explore catalog <ArrowRight size={16} /></a><Link className="button button-ghost" href="/commissions">Start a commission</Link></div><div className="hero-specs"><span><Check size={14} /> Vehicle previews</span><span><Check size={14} /> Roblox-ready delivery</span><span><Check size={14} /> Custom commissions</span></div></section>
    <section className="preview-strip"><div><Play size={17} /><div><p className="eyebrow">SEE IT FIRST</p><strong>Video and carousel previews</strong></div></div><p>Each catalog release can include a YouTube walkaround, image collage, and interactive 360° preview before you buy.</p><a href="/store">Browse releases <ArrowRight size={16} /></a></section>
    <section className="commission-banner"><div><p className="eyebrow">BEYOND THE CATALOG</p><h2>Make the vehicle<br /><em>your own.</em></h2></div><div className="commission-copy"><p>Choose a vehicle, tell us what needs changing, attach a badge or emblem, and keep every detail in one tracked request.</p><Link className="button" href="/commissions">Commission an edit <ArrowRight size={16} /></Link></div></section>
    <section className="trust-grid"><div><ShieldCheck size={19} /><h3>Clear scope</h3><p>Each listing says exactly what is included and what can be commissioned.</p></div><div><Eye size={19} /><h3>Preview before purchase</h3><p>Use video, collage and 360° references to make an informed decision.</p></div><div><SlidersHorizontal size={19} /><h3>Your settings</h3><p>Adjust type size, contrast and motion controls whenever you need them.</p></div></section>
    <div className="accessibility-widget">{accessibilityOpen && <section className="accessibility-panel" aria-label="Accessibility settings"><h2>Accessibility</h2><div className="access-row"><span>𝚃 <strong>Text size</strong></span><div className="text-scale"><button className={fontScale === 0 ? "selected" : ""} onClick={() => setFontScale(0)} aria-label="Default text size">A</button><button className={fontScale === 1 ? "selected" : ""} onClick={() => setFontScale(1)} aria-label="Large text size">A+</button><button className={fontScale === 2 ? "selected" : ""} onClick={() => setFontScale(2)} aria-label="Extra large text size">A++</button></div></div><button className="access-row action" onClick={() => setHighContrast(!highContrast)} aria-pressed={highContrast}><span><Contrast size={17}/><strong>High contrast</strong></span><em>{highContrast ? "On" : "Off"}</em></button><button className="access-row action" onClick={() => setReduceMotion(!reduceMotion)} aria-pressed={reduceMotion}><span><SlidersHorizontal size={17}/><strong>Reduce motion</strong></span><em>{reduceMotion ? "On" : "Off"}</em></button><button className="access-row action" disabled><span><Volume2 size={17}/><strong>Sound</strong></span><em>On</em></button><button className="access-row action" onClick={() => { setFontScale(0); setHighContrast(false); setReduceMotion(false) }}><span><RotateCcw size={17}/><strong>Reset</strong></span></button></section>}<button className="accessibility-trigger" onClick={() => setAccessibilityOpen(!accessibilityOpen)} aria-expanded={accessibilityOpen} aria-label={accessibilityOpen ? "Close accessibility settings" : "Open accessibility settings"}>{accessibilityOpen ? <X size={19}/> : <Accessibility size={19}/>}</button></div>
    <footer><Link className="wordmark" href="/">RYVN<span>®</span></Link><p>Vehicles for worlds in motion.</p><div><Link href="/accessibility">Accessibility</Link><Link href="/settings">Settings</Link><Link href="/login">Discord sign in</Link></div><small>© 2026 RYVN. All rights reserved.</small></footer>
  </main>
}
