import { NextRequest, NextResponse } from "next/server"
import { readSession } from "@/lib/auth"
import { dashboardSummary, listAdminProducts, userById } from "@/lib/data"
export const dynamic = "force-dynamic"
export async function GET(request: NextRequest) {
  const session = readSession(request.cookies.get("ryvn_discord_user")?.value)
  if (!session) return NextResponse.json({ error: "Sign in with Discord." }, { status: 401 })
  const user = await userById(session.id)
  if (!user) return NextResponse.json({ error: "Account is still syncing. Refresh in a moment." }, { status: 404 })
  if (!["owner", "editor"].includes(user.role)) return NextResponse.json({ error: "Dashboard access is limited to RYVN staff." }, { status: 403 })
  return NextResponse.json({ user, summary: await dashboardSummary(), products: await listAdminProducts() })
}
