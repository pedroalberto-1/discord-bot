require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const PREFIX = '!';
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection(); //map

// Caminho da pasta commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Carregar cada comando da pasta
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`Bot is online! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const [cmd, ...args] = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/\s+/);

  const command = client.commands.get(cmd);
  if (command) {
    command.execute(message, args);
  }
});

client.login(process.env.DISCORD_TOKEN);
