import { NextRequest, NextResponse } from "next/server"
export const runtime = "nodejs"
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const clientId = process.env.DISCORD_CLIENT_ID, clientSecret = process.env.DISCORD_CLIENT_SECRET, redirectUri = process.env.DISCORD_REDIRECT_URI
  if (!code || !clientId || !clientSecret || !redirectUri) return NextResponse.redirect(new URL("/login?error=discord_not_configured", request.url))
  const token = await fetch("https://discord.com/api/oauth2/token", { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:new URLSearchParams({client_id:clientId,client_secret:clientSecret,grant_type:"authorization_code",code,redirect_uri:redirectUri}) })
  if (!token.ok) return NextResponse.redirect(new URL("/login?error=discord_failed", request.url))
  const auth = await token.json() as { access_token: string }
  const me = await fetch("https://discord.com/api/users/@me", {headers:{Authorization:`Bearer ${auth.access_token}`}})
  if (!me.ok) return NextResponse.redirect(new URL("/login?error=discord_failed", request.url))
  const user = await me.json() as { id:string; username:string }
  const botToken = process.env.DISCORD_BOT_TOKEN, guildId = process.env.DISCORD_GUILD_ID
  if (botToken && guildId) await fetch(`https://discord.com/api/guilds/${guildId}/members/${user.id}`, {method:"PUT",headers:{Authorization:`Bot ${botToken}`,"Content-Type":"application/json"},body:JSON.stringify({access_token:auth.access_token})})
  const response = NextResponse.redirect(new URL("/profile?connected=1", request.url))
  response.cookies.set("ryvn_discord_user", Buffer.from(JSON.stringify({id:user.id,username:user.username})).toString("base64url"), {httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:60*60*24*7})
  return response
}
