import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

export type SessionUser = { id: string; username: string; avatarUrl?: string | null }

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be configured with at least 32 characters")
  return value
}

function encode(value: string) { return Buffer.from(value).toString("base64url") }
function mac(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url") }

export function signSession(user: SessionUser) {
  const payload = encode(JSON.stringify({ ...user, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
  return `${payload}.${mac(payload)}`
}

export function readSession(value?: string | null): SessionUser | null {
  if (!value) return null
  const [payload, signature] = value.split(".")
  if (!payload || !signature) return null
  const expected = mac(payload)
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as SessionUser & { exp: number }
    return parsed.exp > Date.now() && parsed.id && parsed.username ? { id: parsed.id, username: parsed.username, avatarUrl: parsed.avatarUrl } : null
  } catch { return null }
}

export function randomState() { return randomBytes(32).toString("base64url") }
