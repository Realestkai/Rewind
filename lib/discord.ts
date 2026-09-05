import { setUserRole } from "@/lib/data"

export async function syncDiscordRole(userId: string) {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID
  if (!token || !guildId) return null
  const headers = { Authorization: `Bot ${token}` }
  const [guildResponse, memberResponse] = await Promise.all([
    fetch(`https://discord.com/api/v10/guilds/${guildId}`, { headers }),
    fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, { headers }),
  ])
  if (!memberResponse.ok) return null
  const member = await memberResponse.json() as { roles?: string[] }
  const guild = guildResponse.ok ? await guildResponse.json() as { owner_id?: string } : null
  const role = guild?.owner_id === userId || member.roles?.includes(process.env.DISCORD_OWNER_ROLE_ID ?? "")
    ? "owner"
    : member.roles?.includes(process.env.DISCORD_STAFF_ROLE_ID ?? "") ? "editor" : "customer"
  await setUserRole(userId, role)
  return role
}
