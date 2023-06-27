require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, Events  } = require('discord.js');
const { createAudioPlayer, getVoiceConnection, AudioPlayerStatus, createAudioResource, joinVoiceChannel  } = require('@discordjs/voice');
const { connect } = require('node:http2');
const { get } = require('node:http');

const { TOKEN, VOICE_CHANNEL_ID, GUILD_ID, TEXT_CHANNEL_ID, VOICE_CHANNEL_ID_WORK, CLIENT_ID } = process.env;

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.MessageContent,
  ]});

  client.commands = new Collection();

  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

let guild, voiceChannel, voiceChannelWork, textChannel, clientID, connection;

// When bot comes online check the guild and voice channel are valid
// if they are not found the program will exit
client.on('ready', async () => {
	try {
		guild = await client.guilds.fetch(GUILD_ID);
		voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID);
		voiceChannelWork = guild.channels.cache.get(VOICE_CHANNEL_ID_WORK);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
	textChannel = guild.channels.cache.get(TEXT_CHANNEL_ID);
	console.log('Music ready...');
	//console.log(guild, voiceChannel, voiceChannelWork, textChannel)
	client.user.setPresence({ activities: [{ name: 'jammin...', }], status: 'idle' });
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	//console.log(command);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	else if (command.data.name === 'stop') {
		if (!voiceChannel) { 
			await interaction.reply({ content: 'I am not in a voice channel!', ephemeral: true });
		}
		
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
		if (interaction.commandName === 'play') {
			const voiceChannel = interaction.options.getChannel('channel');
		if (voiceChannel.members.size >= 1) {
			try {
			const resource = createAudioResource('bigben.mp3');
			const player = createAudioPlayer()
			connection = await joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: guild.id,
				adapterCreator: interaction.guild.voiceAdapterCreator
			});
			player.play(resource);	
			connection.subscribe(player);
			// console.log(voiceChannel);
			// console.log(guild);
			} catch(error) {
			console.log(error);
			}
		
		}
		}
		if (interaction.commandName === 'stop') {
			if (connection) {
				connection.destroy();
			}
		}
	}
});
			


client.login(TOKEN);