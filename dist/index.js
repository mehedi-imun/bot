"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ---- Express (Optional: uptime monitoring) ----
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => {
    res.send('✅ Bot is running!');
});
app.listen(PORT, () => {
    console.log(`🌐 Express server running on port ${PORT}`);
});
// ---- Discord Bot Setup ----
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
    ],
});
// ---- Whitelisted users (by username#discriminator) ----
const allowedUsers = [
    'CoolGuy#1234',
    'JaneDoe#5678',
    'BotTester#9999',
];
client.once(discord_js_1.Events.ClientReady, () => {
    var _a;
    console.log(`🤖 Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
});
client.on(discord_js_1.Events.GuildMemberAdd, (member) => __awaiter(void 0, void 0, void 0, function* () {
    const userTag = `${member.user.username}#${member.user.discriminator}`;
    console.log(`➡️ Member joined: ${userTag}`);
    if (!allowedUsers.includes(userTag)) {
        try {
            yield member.send('⛔ You are not on the access list. Please contact an admin.');
        }
        catch (_a) {
            console.warn(`⚠️ Could not DM ${userTag}`);
        }
        try {
            yield member.kick('User not on whitelist');
            console.log(`❌ Kicked: ${userTag}`);
        }
        catch (err) {
            console.error(`❌ Failed to kick ${userTag}:`, err);
        }
    }
    else {
        console.log(`✅ Allowed: ${userTag}`);
    }
}));
// ---- Start Bot ----
client.login(process.env.BOT_TOKEN);
console.log('🤖 Bot is starting...');
