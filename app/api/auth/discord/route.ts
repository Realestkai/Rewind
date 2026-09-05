import { NextResponse } from "next/server"
export const runtime = "nodejs"
export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID
  const redirectUri = process.env.DISCORD_REDIRECT_URI
  if (!clientId || !redirectUri) return NextResponse.redirect(new URL("/login?error=discord_not_configured", process.env.NEXT_PUBLIC_SITE_URL ?? "https://ryvn.space"))
  const url = new URL("https://discord.com/oauth2/authorize")
  url.searchParams.set("client_id", clientId); url.searchParams.set("redirect_uri", redirectUri); url.searchParams.set("response_type", "code"); url.searchParams.set("scope", "identify guilds.join")
  return NextResponse.redirect(url)
}
