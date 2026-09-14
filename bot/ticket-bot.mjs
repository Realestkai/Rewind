import { randomUUID } from "node:crypto"
import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  ModalBuilder,
  PermissionFlagsBits,
  REST,
  Routes,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"

const config = {
  token: process.env.DISCORD_BOT_TOKEN,
  guildId: process.env.DISCORD_GUILD_ID,
  reviewChannelId: process.env.DISCORD_REVIEW_CHANNEL_ID,
  ticketCategoryId: process.env.DISCORD_TICKET_CATEGORY_ID,
  staffRoleId: process.env.DISCORD_STAFF_ROLE_ID,
  ownerRoleId: process.env.DISCORD_OWNER_ROLE_ID,
  showroomChannelId: process.env.DISCORD_SHOWROOM_CHANNEL_ID,
  showroomReaction: process.env.DISCORD_SHOWROOM_REACTION ?? "🔥",
  dataPath: process.env.TICKET_DATA_PATH ?? "./data/tickets.json",
}

for (const [name, value] of Object.entries({
  DISCORD_BOT_TOKEN: config.token,
  DISCORD_GUILD_ID: config.guildId,
  DISCORD_REVIEW_CHANNEL_ID: config.reviewChannelId,
  DISCORD_TICKET_CATEGORY_ID: config.ticketCategoryId,
  DISCORD_STAFF_ROLE_ID: config.staffRoleId,
})) {
  if (!value) throw new Error(`${name} is required.`)
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})
const applications = new Map()
const dataFile = resolve(config.dataPath)

function log(message, details) {
  console.log(`[ticket-bot] ${message}`, details ?? "")
}

function clip(value, length) {
  const text = String(value ?? "").trim()
  return text.length <= length ? text : `${text.slice(0, Math.max(0, length - 1))}…`
}

function answerCard(value, maxLength) {
  const normalized = String(value ?? "").trim().replaceAll("```", "'''") || "Not provided"
  return "```\n" + clip(normalized, maxLength - 8) + "\n```"
}

function ticketStatusLabel(status) {
  return {
    pending: "Awaiting staff review",
    opening: "Being opened",
    claimed: "Open and claimed",
    denied: "Denied",
    closed: "Closed",
  }[status] ?? status
}

function requestType(application) {
  return application.answers.requestType ?? application.answers.subject ?? "Not provided"
}

function vehicleOrCommission(application) {
  return application.answers.vehicle ?? "Not provided"
}

function discordTime(value) {
  return `<t:${Math.floor(new Date(value).getTime() / 1000)}:F>`
}

async function loadApplications() {
  try {
    const raw = await readFile(dataFile, "utf8")
    const saved = JSON.parse(raw)
    for (const application of saved.applications ?? []) applications.set(application.id, application)
    log(`Loaded ${applications.size} ticket application(s).`)
  } catch (error) {
    if (error.code !== "ENOENT") throw error
    log("No saved ticket data found; starting with an empty review queue.")
  }
}

async function saveApplications() {
  await mkdir(dirname(dataFile), { recursive: true })
  const temporaryFile = `${dataFile}.tmp`
  await writeFile(
    temporaryFile,
    JSON.stringify({ applications: [...applications.values()] }, null, 2),
    "utf8",
  )
  await rename(temporaryFile, dataFile)
}

function isStaff(interaction) {
  if (!interaction.inGuild()) return false
  if (interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) return true

  const allowedRoleIds = [config.staffRoleId, config.ownerRoleId].filter(Boolean)
  const roles = interaction.member?.roles
  const hasRole = (roleId) => {
    if (Array.isArray(roles)) return roles.includes(roleId)
    return Boolean(roles?.cache?.has(roleId))
  }

  return allowedRoleIds.some(hasRole)
}

function hasActiveApplication(userId) {
  return [...applications.values()].some(
    (application) =>
      application.userId === userId && ["pending", "opening", "claimed"].includes(application.status),
  )
}

function reviewEmbed(application) {
  const colors = {
    pending: 0xf1c40f,
    opening: 0x3498db,
    claimed: 0x2ecc71,
    denied: 0xe74c3c,
    closed: 0x95a5a6,
  }

  const embed = new EmbedBuilder()
    .setColor(colors[application.status] ?? 0x5865f2)
    .setTitle(`RYVN request review · ${ticketStatusLabel(application.status)}`)
    .setDescription("**FULL REQUEST DETAILS**\n" + answerCard(application.answers.details, 4_000))
    .addFields(
      { name: "TICKET OPENER", value: `> <@${application.userId}> (${clip(application.userTag, 80)})`, inline: false },
      { name: "REQUEST TYPE", value: answerCard(requestType(application), 1_024), inline: true },
      { name: "VEHICLE / COMMISSION", value: answerCard(vehicleOrCommission(application), 1_024), inline: true },
      { name: "ORDER, INVOICE, OR ROBLOX USER", value: answerCard(application.answers.reference, 1_024), inline: false },
      { name: "SUBMITTED", value: discordTime(application.createdAt), inline: true },
    )
    .setFooter({ text: `Application ID: ${application.id}` })

  if (application.claimedBy) {
    embed.addFields({ name: "CLAIMED BY", value: `> <@${application.claimedBy}>`, inline: true })
  }
  if (application.denialReason) {
    embed.addFields({ name: "DENIAL REASON", value: answerCard(application.denialReason, 1_024), inline: false })
  }

  return embed
}

function ticketEmbed(application) {
  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle(`RYVN request · ${clip(requestType(application), 200)}`)
    .setDescription(`Welcome <@${application.userId}>. A staff member has accepted and claimed your request.\n\n**FULL REQUEST DETAILS**\n${answerCard(application.answers.details, 3_700)}`)
    .addFields(
      { name: "VEHICLE / COMMISSION", value: answerCard(vehicleOrCommission(application), 1_024), inline: false },
      { name: "ORDER, INVOICE, OR ROBLOX USER", value: answerCard(application.answers.reference, 1_024), inline: false },
      { name: "CLAIMED BY", value: `> <@${application.claimedBy}>`, inline: true },
    )
    .setFooter({ text: `Ticket application: ${application.id}` })
}

function panelEmbed() {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("RYVN vehicle support & commissions")
    .setDescription(
      "Open a request for a purchased vehicle, a custom commission, or a vehicle you are interested in. Staff reviews every request before a private ticket is created.",
    )
    .setFooter({ text: "Include the vehicle, purchase details, or clear commission specifications." })
}

function reviewButtons(application) {
  if (application.status !== "pending") return []
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ticket:claim:${application.id}`)
        .setLabel("Claim & open")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`ticket:deny:${application.id}`)
        .setLabel("Deny")
        .setStyle(ButtonStyle.Danger),
    ),
  ]
}

function closeButtons(application) {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ticket:close:${application.id}`)
        .setLabel("Close ticket")
        .setStyle(ButtonStyle.Secondary),
    ),
  ]
}

function applicationModal() {
  const requestTypeInput = new TextInputBuilder()
    .setCustomId("request-type")
    .setLabel("What do you need help with?")
    .setPlaceholder("Vehicle support, commission, or purchase help")
    .setStyle(TextInputStyle.Short)
    .setMinLength(3)
    .setMaxLength(100)
    .setRequired(true)
  const vehicleInput = new TextInputBuilder()
    .setCustomId("vehicle")
    .setLabel("Which vehicle or commission?")
    .setPlaceholder("Vehicle name, model, or the build you want")
    .setStyle(TextInputStyle.Short)
    .setMinLength(2)
    .setMaxLength(200)
    .setRequired(true)
  const details = new TextInputBuilder()
    .setCustomId("details")
    .setLabel("Describe your issue or request")
    .setPlaceholder("Include the issue, wanted changes, platform, or commission specifications.")
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(10)
    .setMaxLength(4_000)
    .setRequired(true)
  const reference = new TextInputBuilder()
    .setCustomId("reference")
    .setLabel("Order, invoice, or Roblox user (optional)")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(200)
    .setRequired(false)

  return new ModalBuilder()
    .setCustomId("ticket:submit")
    .setTitle("RYVN support & commission request")
    .addComponents(
      new ActionRowBuilder().addComponents(requestTypeInput),
      new ActionRowBuilder().addComponents(vehicleInput),
      new ActionRowBuilder().addComponents(details),
      new ActionRowBuilder().addComponents(reference),
    )
}

function reasonModal(customId, title, label) {
  const reason = new TextInputBuilder()
    .setCustomId("reason")
    .setLabel(label)
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(3)
    .setMaxLength(1_000)
    .setRequired(true)

  return new ModalBuilder()
    .setCustomId(customId)
    .setTitle(title)
    .addComponents(new ActionRowBuilder().addComponents(reason))
}

function channelName(application) {
  const source = application.userTag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  return `ticket-${(source || application.userId).slice(0, 70)}`
}

async function removeReviewMessage(application) {
  try {
    const channel = await client.channels.fetch(application.reviewChannelId)
    if (!channel?.isTextBased()) return
    const message = await channel.messages.fetch(application.reviewMessageId)
    await message.delete()
  } catch (error) {
    // The review message may already have been manually removed. The application state is still valid.
    log("Could not remove review message", error.message)
  }
}

async function dmUser(userId, embed) {
  try {
    const user = await client.users.fetch(userId)
    await user.send({ embeds: [embed], allowedMentions: { parse: [] } })
    return true
  } catch (error) {
    log(`Could not DM user ${userId}`, error.message)
    return false
  }
}

async function createTicketChannel(application, staffUserId) {
  const guild = await client.guilds.fetch(config.guildId)
  const permissions = [
    {
      id: guild.roles.everyone.id,
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: application.userId,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
    },
    {
      id: config.staffRoleId,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
    },
  ]

  if (config.ownerRoleId && config.ownerRoleId !== config.staffRoleId) {
    permissions.push({
      id: config.ownerRoleId,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
    })
  }

  const ticketChannel = await guild.channels.create({
    name: channelName(application),
    type: ChannelType.GuildText,
    parent: config.ticketCategoryId,
    topic: `Ticket ${application.id} · opener ${application.userId} · claimed by ${staffUserId}`,
    permissionOverwrites: permissions,
    reason: `Accepted ticket application ${application.id} by staff member ${staffUserId}`,
  })

  return ticketChannel
}

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(config.token)
  await rest.put(Routes.applicationGuildCommands(client.user.id, config.guildId), {
    body: [
      {
        name: "ticket-panel",
        description: "Post the ticket application panel in this channel.",
      },
    ],
  })
  log("Registered the /ticket-panel command.")
}

async function handlePanelCommand(interaction) {
  if (!isStaff(interaction)) {
    await interaction.reply({ content: "Only staff can post the ticket panel.", ephemeral: true })
    return
  }

  await interaction.channel.send({
    embeds: [panelEmbed()],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("ticket:open").setLabel("Open a request").setStyle(ButtonStyle.Primary),
      ),
    ],
  })
  await interaction.reply({ content: "Ticket panel posted.", ephemeral: true })
}

async function handleApplicationSubmission(interaction) {
  if (interaction.guildId !== config.guildId) {
    await interaction.reply({ content: "This ticket bot is not configured for this server.", ephemeral: true })
    return
  }
  if (hasActiveApplication(interaction.user.id)) {
    await interaction.reply({
      content: "You already have a ticket awaiting review or currently open.",
      ephemeral: true,
    })
    return
  }

  await interaction.deferReply({ ephemeral: true })
  const application = {
    id: randomUUID(),
    userId: interaction.user.id,
    userTag: interaction.user.tag,
    createdAt: new Date().toISOString(),
    status: "pending",
    answers: {
      requestType: interaction.fields.getTextInputValue("request-type"),
      vehicle: interaction.fields.getTextInputValue("vehicle"),
      details: interaction.fields.getTextInputValue("details"),
      reference: interaction.fields.getTextInputValue("reference"),
    },
  }

  applications.set(application.id, application)
  try {
    const reviewChannel = await client.channels.fetch(config.reviewChannelId)
    if (!reviewChannel?.isTextBased()) throw new Error("DISCORD_REVIEW_CHANNEL_ID is not a text channel.")

    const reviewMessage = await reviewChannel.send({
      embeds: [reviewEmbed(application)],
      components: reviewButtons(application),
      allowedMentions: { parse: [] },
    })
    application.reviewChannelId = reviewChannel.id
    application.reviewMessageId = reviewMessage.id
    await saveApplications()
  } catch (error) {
    applications.delete(application.id)
    await saveApplications()
    throw error
  }

  await interaction.editReply(
    "Your request has been sent to staff for review. A private ticket will open only if a staff member accepts it.",
  )
}

async function handleClaim(interaction, applicationId) {
  if (!isStaff(interaction)) {
    await interaction.reply({ content: "Only staff can claim ticket applications.", ephemeral: true })
    return
  }
  const application = applications.get(applicationId)
  if (!application || application.status !== "pending") {
    await interaction.reply({ content: "This application is no longer awaiting review.", ephemeral: true })
    return
  }

  await interaction.deferReply({ ephemeral: true })
  application.status = "opening"
  await saveApplications()

  let ticketChannel
  try {
    ticketChannel = await createTicketChannel(application, interaction.user.id)
  } catch (error) {
    application.status = "pending"
    await saveApplications()
    throw error
  }

  application.status = "claimed"
  application.claimedBy = interaction.user.id
  application.claimedAt = new Date().toISOString()
  application.ticketChannelId = ticketChannel.id
  await saveApplications()

  try {
    await ticketChannel.send({
      content: `<@${application.userId}>`,
      embeds: [ticketEmbed(application)],
      components: closeButtons(application),
      allowedMentions: { users: [application.userId] },
    })
    await interaction.message.edit({ embeds: [reviewEmbed(application)], components: [] })
    await interaction.editReply(`Ticket accepted and created: <#${ticketChannel.id}>`)
  } catch (error) {
    log(`Ticket ${application.id} was created, but its follow-up message could not be posted`, error.message)
    await interaction.editReply(`Ticket created: <#${ticketChannel.id}>. The review card could not be updated automatically.`)
  }
}

async function handleDenial(interaction, applicationId) {
  if (!isStaff(interaction)) {
    await interaction.reply({ content: "Only staff can deny ticket applications.", ephemeral: true })
    return
  }
  const application = applications.get(applicationId)
  if (!application || application.status !== "pending") {
    await interaction.reply({ content: "This application is no longer awaiting review.", ephemeral: true })
    return
  }

  await interaction.deferReply({ ephemeral: true })
  application.status = "denied"
  application.deniedBy = interaction.user.id
  application.deniedAt = new Date().toISOString()
  application.denialReason = interaction.fields.getTextInputValue("reason")
  await saveApplications()

  await removeReviewMessage(application)
  const dmDelivered = await dmUser(
    application.userId,
    new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle("Your ticket request was denied")
      .setDescription("A staff member reviewed your request and was unable to accept it.")
      .addFields(
        { name: "REQUEST TYPE", value: answerCard(requestType(application), 1_024), inline: false },
        { name: "VEHICLE / COMMISSION", value: answerCard(vehicleOrCommission(application), 1_024), inline: false },
        { name: "STAFF REASON", value: answerCard(application.denialReason, 1_024), inline: false },
      )
      .setFooter({ text: "You may submit a new ticket if your situation changes." }),
  )

  await interaction.editReply(
    dmDelivered
      ? "Ticket application denied, removed from the review queue, and the opener has been notified."
      : "Ticket application denied and removed from the review queue. The opener could not be DMed (their DMs may be disabled).",
  )
}

async function handleClose(interaction, applicationId) {
  if (!isStaff(interaction)) {
    await interaction.reply({ content: "Only staff can close tickets.", ephemeral: true })
    return
  }
  const application = applications.get(applicationId)
  if (!application || application.status !== "claimed") {
    await interaction.reply({ content: "This ticket is already closed or unavailable.", ephemeral: true })
    return
  }

  await interaction.deferReply({ ephemeral: true })
  application.status = "closed"
  application.closedBy = interaction.user.id
  application.closedAt = new Date().toISOString()
  application.closeReason = interaction.fields.getTextInputValue("reason")
  await saveApplications()

  const dmDelivered = await dmUser(
    application.userId,
    new EmbedBuilder()
      .setColor(0x95a5a6)
      .setTitle("Your ticket was closed")
      .addFields({ name: "Reason", value: clip(application.closeReason, 1_024), inline: false })
      .setFooter({ text: "You can open a new ticket if you still need help." }),
  )

  await interaction.editReply(
    dmDelivered ? "Ticket closed; the opener was notified." : "Ticket closed; the opener could not be DMed.",
  )
  const ticketChannel = await client.channels.fetch(application.ticketChannelId).catch(() => null)
  if (ticketChannel?.isTextBased()) {
    await ticketChannel.delete(`Closed by ${interaction.user.tag}: ${clip(application.closeReason, 200)}`)
  }
}

client.once(Events.ClientReady, async (readyClient) => {
  log(`Ready as ${readyClient.user.tag}`)
  try {
    await registerCommands()
  } catch (error) {
    log("Could not register commands", error.message)
  }
})

client.on(Events.MessageCreate, async (message) => {
  if (
    !config.showroomChannelId ||
    message.author.bot ||
    message.channelId !== config.showroomChannelId ||
    message.attachments.size === 0
  ) {
    return
  }

  try {
    await message.react(config.showroomReaction)
    log("Reacted to a showroom image", { messageId: message.id, channelId: message.channelId })
  } catch (error) {
    log("Could not react to showroom image", error.message)
  }
})

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === "ticket-panel") {
      await handlePanelCommand(interaction)
      return
    }

    if (interaction.isButton()) {
      if (interaction.customId === "ticket:open") {
        if (interaction.guildId !== config.guildId) {
          await interaction.reply({ content: "This ticket bot is not configured for this server.", ephemeral: true })
        } else if (hasActiveApplication(interaction.user.id)) {
          await interaction.reply({
            content: "You already have a ticket awaiting review or currently open.",
            ephemeral: true,
          })
        } else {
          await interaction.showModal(applicationModal())
        }
        return
      }

      const [scope, action, applicationId] = interaction.customId.split(":")
      if (scope !== "ticket" || !applicationId) return
      if (action === "claim") await handleClaim(interaction, applicationId)
      if (action === "deny") {
        if (!isStaff(interaction)) {
          await interaction.reply({ content: "Only staff can deny ticket applications.", ephemeral: true })
        } else {
          await interaction.showModal(reasonModal(`ticket:deny-reason:${applicationId}`, "Deny ticket application", "Why is this request being denied?"))
        }
      }
      if (action === "close") {
        if (!isStaff(interaction)) {
          await interaction.reply({ content: "Only staff can close tickets.", ephemeral: true })
        } else {
          await interaction.showModal(reasonModal(`ticket:close-reason:${applicationId}`, "Close ticket", "Why is this ticket being closed?"))
        }
      }
      return
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "ticket:submit") {
        await handleApplicationSubmission(interaction)
        return
      }

      const [scope, action, applicationId] = interaction.customId.split(":")
      if (scope !== "ticket" || !applicationId) return
      if (action === "deny-reason") await handleDenial(interaction, applicationId)
      if (action === "close-reason") await handleClose(interaction, applicationId)
    }
  } catch (error) {
    log("Interaction failed", error.stack ?? error.message)
    const response = { content: "Something went wrong while processing that ticket action. Please try again.", ephemeral: true }
    if (interaction.deferred || interaction.replied) await interaction.editReply(response)
    else await interaction.reply(response)
  }
})

await loadApplications()
log("Starting Rewind ticket bot")
await client.login(config.token)
