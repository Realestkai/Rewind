import { NextRequest, NextResponse } from "next/server"
import { readSession } from "@/lib/auth"
import { commissionProductId, createCommission, dataConfigured } from "@/lib/data"

export const runtime = "nodejs"

async function createTicket(userId: string, username: string, details: string) {
  const token = process.env.DISCORD_BOT_TOKEN
  const guild = process.env.DISCORD_GUILD_ID
  const category = process.env.DISCORD_TICKET_CATEGORY_ID
  if (!token || !guild || !category) return null
  const safeName = username.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 48)
  const ticket = await fetch(`https://discord.com/api/v10/guilds/${guild}/channels`, {
    method: "POST",
    headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: `ticket-${safeName}`, type: 0, parent_id: category, permission_overwrites: [
      { id: guild, type: 0, deny: "1024" },
      { id: userId, type: 1, allow: "3072" },
      ...(process.env.DISCORD_STAFF_ROLE_ID ? [{ id: process.env.DISCORD_STAFF_ROLE_ID, type: 0, allow: "3072" }] : []),
    ] }),
  })
  if (!ticket.ok) return null
  const channel = await ticket.json() as { id: string }
  await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, { method: "POST", headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ content: `New RYVN commission request from <@${userId}>.\n\n${details}` }) })
  return channel.id
}

export async function POST(request: NextRequest) {
  if (!dataConfigured) return NextResponse.json({ error: "Database is not configured" }, { status: 503 })
  const user = readSession(request.cookies.get("ryvn_discord_user")?.value)
  if (!user) return NextResponse.json({ error: "Sign in with Discord before submitting a commission." }, { status: 401 })
  const body = await request.json() as { vehicle?: string; requestTypes?: string[]; details?: string; attachmentUrl?: string }
  const details = body.details?.trim()
  if (!details || details.length < 10 || details.length > 4000) return NextResponse.json({ error: "Please provide 10–4,000 characters describing the request." }, { status: 400 })
  const productId = await commissionProductId(body.vehicle)
  const channelId = await createTicket(user.id, user.username, details)
  const commission = await createCommission({ userId: user.id, productId, requestTypes: (body.requestTypes ?? []).slice(0, 8), details, attachmentUrl: body.attachmentUrl, channelId })
  return NextResponse.json({ commission, ticketCreated: Boolean(channelId) }, { status: 201 })
}
