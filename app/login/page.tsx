import Link from "next/link"
import { cookies } from "next/headers"
import { MessageCircle } from "lucide-react"
import { readSession } from "@/lib/auth"
export default async function LoginPage(){const user=readSession((await cookies()).get("ryvn_discord_user")?.value);return <main className="auth-page"><Link href="/" className="wordmark">RYVN<span>®</span></Link><section><p className="eyebrow">MEMBER ACCESS</p><h1>{user?"You are signed in.":"Your RYVN account."}</h1><p>{user?`Connected as ${user.username}. Your profile, commissions, reviews, and dashboard use this same Discord account.`:"Sign in with Discord to keep purchases, commissions, tickets and reviews together."}</p>{user?<Link href="/profile" className="discord-button">Open your profile</Link>:<a href="/api/auth/discord" className="discord-button"><MessageCircle size={19}/> Continue with Discord</a>}<Link href="/">Return to RYVN</Link></section></main>}
