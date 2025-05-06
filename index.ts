import express from 'express';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// ---- Express (Optional: uptime monitoring) ----
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

// ---- Whitelisted users (by username#discriminator) ----
const allowedUsers = [
  'CoolGuy#1234',
  'JaneDoe#5678',
  'BotTester#9999',
];

client.once(Events.ClientReady, () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  const userTag = `${member.user.username}#${member.user.discriminator}`;
  console.log(`➡️ Member joined: ${userTag}`);

  if (!allowedUsers.includes(userTag)) {
    try {
      await member.send('⛔ You are not on the access list. Please contact an admin.');
    } catch {
      console.warn(`⚠️ Could not DM ${userTag}`);
    }

    try {
      await member.kick('User not on whitelist');
      console.log(`❌ Kicked: ${userTag}`);
    } catch (err) {
      console.error(`❌ Failed to kick ${userTag}:`, err);
    }
  } else {
    console.log(`✅ Allowed: ${userTag}`);
  }
});

// ---- Start Bot ----
client.login(process.env.BOT_TOKEN);
console.log('🤖 Bot is starting...');
