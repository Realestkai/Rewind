import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
export const metadata: Metadata = { title: "RYVN — Roblox vehicles, refined", description: "A curated Roblox vehicle marketplace with commissions and detailed previews.", metadataBase: new URL("https://ryvn.space") }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}<Analytics /></body></html> }
