# RYVN showroom reaction worker

This is a separate Railway worker, not part of the Vercel deployment. It keeps a Discord Gateway connection and reacts with 🔥 when a member posts an attachment in `#showroom`.

## Deploy it on Railway

1. In the existing Railway project, select **New** → **GitHub Repo**, then select the `Realestkai/Rewind` repository.
2. In the new service's **Settings**, set the start command to:

   ```text
   node bot/showroom-reactor.mjs
   ```

3. Add these Railway variables to the new service:

   ```text
   DISCORD_BOT_TOKEN=<the bot token already used by RYVN>
   DISCORD_SHOWROOM_CHANNEL_ID=1545673789885513789
   ```

4. Deploy the service.
5. In Discord Developer Portal → **RYVN** → **Bot**, enable **Message Content Intent**.
6. In the `#showroom` channel, give the **RYVN Bot** role: View Channel, Read Message History, and Add Reactions.

The worker deliberately ignores messages from bots, so it cannot react to its own reaction or create loops.
