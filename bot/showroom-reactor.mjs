/**
 * Railway worker for RYVN's #showroom.
 * Reacts with 🔥 whenever a member posts one or more images.
 * Run this as a separate Railway service: node bot/showroom-reactor.mjs
 */
const token = process.env.DISCORD_BOT_TOKEN
const showroomChannelId = process.env.DISCORD_SHOWROOM_CHANNEL_ID

if (!token || !showroomChannelId) {
  throw new Error("DISCORD_BOT_TOKEN and DISCORD_SHOWROOM_CHANNEL_ID are required.")
}

const gatewayUrl = "wss://gateway.discord.gg/?v=10&encoding=json"
const intents = 1 | 512 | 32768 // GUILDS, GUILD_MESSAGES, MESSAGE_CONTENT
let sequence = null
let heartbeatTimer = null
let reconnectTimer = null

function log(message, details) {
  console.log(`[showroom-reactor] ${message}`, details ?? "")
}

async function addFireReaction(channelId, messageId) {
  const response = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions/%F0%9F%94%A5/@me`,
    { method: "PUT", headers: { Authorization: `Bot ${token}` } },
  )

  if (!response.ok && response.status !== 204) {
    log("Could not add fire reaction", { status: response.status, body: await response.text() })
  }
}

function connect() {
  const socket = new WebSocket(gatewayUrl)

  socket.addEventListener("open", () => log("Connected to Discord Gateway"))
  socket.addEventListener("message", async ({ data }) => {
    const event = JSON.parse(String(data))
    if (event.s !== null && event.s !== undefined) sequence = event.s

    if (event.op === 10) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ op: 1, d: sequence }))
        }
      }, event.d.heartbeat_interval)

      socket.send(JSON.stringify({
        op: 2,
        d: {
          token,
          intents,
          properties: { os: "linux", browser: "ryvn-showroom", device: "ryvn-showroom" },
        },
      }))
      return
    }

    if (event.op === 7 || event.op === 9) {
      log("Discord requested a reconnect")
      socket.close()
      return
    }

    if (event.t !== "MESSAGE_CREATE") return
    const message = event.d
    if (
      message.channel_id !== showroomChannelId ||
      message.author?.bot ||
      !Array.isArray(message.attachments) ||
      message.attachments.length === 0
    ) return

    await addFireReaction(message.channel_id, message.id)
  })

  socket.addEventListener("error", (event) => log("Gateway error", event.message))
  socket.addEventListener("close", () => {
    clearInterval(heartbeatTimer)
    clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(connect, 5000)
    log("Disconnected; reconnecting in five seconds")
  })
}

connect()
