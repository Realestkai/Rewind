import { NextRequest, NextResponse } from "next/server"
import { readSession } from "@/lib/auth"
import { dashboardSummary, userById } from "@/lib/data"
export const dynamic = "force-dynamic"
export async function GET(request: NextRequest) {
  const session = readSession(request.cookies.get("ryvn_discord_user")?.value)
  if (!session) return NextResponse.json({ error: "Sign in with Discord." }, { status: 401 })
  const user = await userById(session.id)
  if (!user) return NextResponse.json({ error: "Account is still syncing. Refresh in a moment." }, { status: 404 })
  return NextResponse.json({ user, summary: await dashboardSummary() })
}
