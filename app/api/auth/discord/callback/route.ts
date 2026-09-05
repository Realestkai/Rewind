import { NextRequest, NextResponse } from "next/server"
import { signSession } from "@/lib/auth"
import { setUserRole, upsertUser } from "@/lib/data"
export const runtime = "nodejs"
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  const clientId = process.env.DISCORD_CLIENT_ID, clientSecret = process.env.DISCORD_CLIENT_SECRET, redirectUri = process.env.DISCORD_REDIRECT_URI
  if (!code || !state || state !== request.cookies.get("ryvn_oauth_state")?.value || !clientId || !clientSecret || !redirectUri) return NextResponse.redirect(new URL("/login?error=discord_failed", request.url))
  const token = await fetch("https://discord.com/api/oauth2/token", { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:new URLSearchParams({client_id:clientId,client_secret:clientSecret,grant_type:"authorization_code",code,redirect_uri:redirectUri}) })
  if (!token.ok) return NextResponse.redirect(new URL("/login?error=discord_failed", request.url))
  const auth = await token.json() as { access_token: string }
  const me = await fetch("https://discord.com/api/users/@me", {headers:{Authorization:`Bearer ${auth.access_token}`}})
  if (!me.ok) return NextResponse.redirect(new URL("/login?error=discord_failed", request.url))
  const user = await me.json() as { id:string; username:string; avatar?: string | null }
  const botToken = process.env.DISCORD_BOT_TOKEN, guildId = process.env.DISCORD_GUILD_ID
  if (botToken && guildId) await fetch(`https://discord.com/api/guilds/${guildId}/members/${user.id}`, {method:"PUT",headers:{Authorization:`Bot ${botToken}`,"Content-Type":"application/json"},body:JSON.stringify({access_token:auth.access_token})})
  await upsertUser({ id: user.id, username: user.username, avatarUrl: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null })
  // Discord roles are the source of truth for marketplace publishing access.
  if (botToken && guildId) {
    const membership = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${user.id}`, { headers: { Authorization: `Bot ${botToken}` } })
    if (membership.ok) {
      const member = await membership.json() as { roles?: string[] }
      const role = member.roles?.includes(process.env.DISCORD_OWNER_ROLE_ID ?? "") ? "owner" : member.roles?.includes(process.env.DISCORD_STAFF_ROLE_ID ?? "") ? "editor" : "customer"
      await setUserRole(user.id, role)
    }
  }
  const response = NextResponse.redirect(new URL("/profile?connected=1", request.url))
  response.cookies.set("ryvn_discord_user", signSession({id:user.id,username:user.username,avatarUrl:user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null}), {httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:60*60*24*7})
  response.cookies.delete("ryvn_oauth_state")
  return response
}
