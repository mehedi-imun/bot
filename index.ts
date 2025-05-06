import express from 'express';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// ---- Express (Optional: for uptime pinging) ----
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_, res) => {
  res.send('✅ Bot is running!');
});

app.listen(PORT, () => {
  console.log(`🌐 Express server running on port ${PORT}`);
});

// ---- Discord Bot Setup ----
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// ---- Whitelisted usernames only (no discriminator) ----
const allowedUsernames = [
  'coolguy',
  'hello_rakib',
  'bottester',
];

client.once(Events.ClientReady, () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  const username = member.user.username.toLowerCase();
  console.log(`➡️ Member joined: ${username}`);

  if (!allowedUsernames.includes(username)) {
    try {
      await member.send('⛔ You are not on the access list. Please contact an admin.');
    } catch {
      console.warn(`⚠️ Could not DM ${username}`);
    }

    try {
      await member.kick('User not on whitelist');
      console.log(`❌ Kicked: ${username}`);
    } catch (err) {
      console.error(`❌ Failed to kick ${username}:`, err);
    }
  } else {
    console.log(`✅ Allowed: ${username}`);
  }
});

// ---- Start Bot ----
client.login(process.env.BOT_TOKEN);
console.log('🤖 Bot is starting...');
