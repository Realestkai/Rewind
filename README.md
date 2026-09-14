# Rewind ticket bot

Rewind is now a Discord ticket bot only. There is no website or dashboard.

It also retains the showroom feature: when `DISCORD_SHOWROOM_CHANNEL_ID` is set, the bot reacts to each post containing an image attachment in that channel. The reaction defaults to `🔥` and can be changed with `DISCORD_SHOWROOM_REACTION`.

## Ticket workflow

1. A staff member runs `/ticket-panel` in the channel where members should request help.
2. A member selects **Open a ticket** and completes the subject, full-details, and optional reference/contact questions.
3. No ticket channel is created yet. The answers are posted as a private embed in `DISCORD_REVIEW_CHANNEL_ID` for staff.
4. A staff member can read the whole request, then choose **Claim & open** or **Deny**.
5. Claiming creates a private channel in `DISCORD_TICKET_CATEGORY_ID` for the opener, staff role, and optional owner role. The accepted request is included in its opening embed.
6. Denying requires a written reason. The review request is deleted and the opener receives a DM with that reason. Since approval happens before a channel is created, a denied request never exposes a ticket channel.
7. Staff can close an accepted ticket with a required reason. This DMs the opener and deletes the channel.

Members can have only one request awaiting review or open at once.

## Setup

1. Create a Discord application and bot. Invite it to the server with the `bot` and `applications.commands` scopes.
2. Give the bot permission to View Channels, Send Messages, Add Reactions, Embed Links, Manage Channels, and Read Message History. It also needs access to the review channel and ticket category. If showroom reactions are enabled, turn on **Message Content Intent** in the Discord Developer Portal and give the bot access to that channel.
3. Copy `.env.example` to `.env` locally, or add the same variables in Railway. Fill in every required ID.
4. Run `pnpm install` and then `pnpm start`.
5. In Discord, run `/ticket-panel` as a staff member to create the member-facing ticket panel.

### Persistent review queue

Applications are stored in `TICKET_DATA_PATH`. For Railway, attach a Volume and set this to a path inside that mounted volume, for example `/data/tickets.json`. Without a Volume, pending review cards still work while the service remains up, but Railway restarts clear their backing file.

## Railway

The included `railway.toml` starts the bot with `pnpm start`. Configure the Discord environment variables in the service settings. Do not set a public domain; this is a worker service, not a web application.
