"use client"
import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Upload, ArrowRight } from "lucide-react"
import { products } from "@/lib/catalog"
export default function CommissionsPage() {
  return <Suspense fallback={<main className="form-page"><header className="site-header"><Link href="/" className="wordmark">RYVN<span>®</span></Link></header><section className="form-intro"><p className="eyebrow">RYVN COMMISSIONS</p><h1>Loading commission request…</h1></section></main>}><CommissionForm /></Suspense>
}
function CommissionForm() {
  const searchParams = useSearchParams(); const selected = searchParams.get("vehicle") ?? ""
  return <main className="form-page"><header className="site-header"><Link href="/" className="wordmark">RYVN<span>®</span></Link><Link className="quiet-link" href="/#catalog">Catalog</Link></header><section className="form-intro"><p className="eyebrow">RYVN COMMISSIONS</p><h1>Shape the details.</h1><p>Request an edit for a catalog vehicle. Your request becomes a tracked job and can be handed to the Discord ticket bot once it is connected.</p></section><form className="commission-form"><label>Vehicle<select defaultValue={selected}><option value="">Choose a vehicle</option>{products.map(p=><option key={p.slug} value={p.slug}>{p.brand} {p.name}</option>)}</select></label><fieldset><legend>What would you like changed?</legend><label className="check-row"><input type="checkbox"/> Remove badge / emblems and the model divot</label><label className="check-row"><input type="checkbox"/> Add a custom emblem or vehicle name</label><label className="check-row"><input type="checkbox"/> Other visual edit</label></fieldset><label>Describe the request<textarea placeholder="Tell us what needs to change, where it is on the vehicle, and how you want it to look." rows={6}/></label><label>Badge / emblem image <span className="optional">PNG or JPG</span><span className="upload"><Upload size={17}/> Choose file<input type="file" accept=".png,.jpg,.jpeg" /></span></label><div className="ticket-note"><strong>Discord ticket</strong><p>When the ticket bot is ready, submitting this form will create a private Discord ticket with your request and attachment.</p></div><button type="button" className="button">Save commission request <ArrowRight size={16}/></button></form></main>
}
