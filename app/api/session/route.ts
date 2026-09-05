import { NextRequest, NextResponse } from "next/server"
import { readSession } from "@/lib/auth"

export const dynamic = "force-dynamic"
export function GET(request: NextRequest) {
  const user = readSession(request.cookies.get("ryvn_discord_user")?.value)
  return NextResponse.json({ user })
}
