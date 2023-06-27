require('dotenv').config();
const { Client, GatewayIntentBits, Discord } = require('discord.js');
const cron = require('node-cron');
const { createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, createAudioResource, joinVoiceChannel  } = require('@discordjs/voice');


const { TOKEN, VOICE_CHANNEL_ID, GUILD_ID, TEXT_CHANNEL_ID, VOICE_CHANNEL_ID_WORK } = process.env;

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

let guild, voiceChannel, voiceChannelWork, textChannel ;

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
	console.log('Big Ben Ready...');
	//console.log(guild, voiceChannel, voiceChannelWork, textChannel)
	client.user.setPresence({ activities: [{ name: 'the waiting game...', }], status: 'idle' });
});

// use node-cron to create a job to run every hour
const task = cron.schedule('0 0 */1 * * *', async () => {
	let { hour, amPm, timezoneOffsetString } = getTimeInfo();
	// console.log('1min');
	// if text channel was defined send message in chat
	// if (textChannel) {
	// 	textChannel.send(`The time is now ${hour}:00 ${amPm} GMT${timezoneOffsetString}`);
	// }

	// check if VC defined in config is empty
	if (voiceChannel.members.size >= 1) {
		try {
			client.user.setPresence({ activities: [{ name: 'BONG', }], status: 'online' });
			// connect to voice channel
			const connection = await joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: guild.id,
				adapterCreator: guild.voiceAdapterCreator,
			});
			// counter for looping
			let count = 1;
		
			// immediately invoked function that loops to play the bell sound 
			(function play() {
				console.log('playing');
				const resource = createAudioResource('bigben.mp3');
				const player = createAudioPlayer();
				player.play(resource);
				connection.subscribe(player);
				
				player.on(AudioPlayerStatus.Idle, () => {
					connection.destroy();
					client.user.setPresence({ activities: [{ name: 'the waiting game...', }], status: 'idle' });
				})
			})();
		} catch(error) {
			console.log(error);
		}
	}
// });

	if (voiceChannelWork.members.size >= 1) {
		try {
			client.user.setPresence({ activities: [{ name: 'BONG', }], status: 'online' });
			// connect to voice channel
			const connection = await joinVoiceChannel({
				channelId: voiceChannelWork.id,
				guildId: guild.id,
				adapterCreator: guild.voiceAdapterCreator,
			});
			// counter for looping
			let count = 1;
		
			// immediately invoked function that loops to play the bell sound 
			(function play() {
				console.log('playing');
				const resource = createAudioResource('bigben.mp3');
				const player = createAudioPlayer();
				player.play(resource);
				connection.subscribe(player);
				
				player.on(AudioPlayerStatus.Idle, () => {
					connection.destroy();
					client.user.setPresence({ activities: [{ name: 'the waiting game...', }], status: 'idle' });
				})
			})();

		} catch(error) {
			console.log(error);
		}
	}
});
// function to get current time and return object containing
// hour and if it is am or pm
const getTimeInfo = () => {
	    
		let time = new Date();
		// let minutes = time.getMinutes();
		let hour = time.getHours() >= 12 ? time.getHours() - 12 : time.getHours();
		hour = hour === 0 ? 12 : hour;
		let amPm = time.getHours() >= 12 ? 'PM' : 'AM';
		// get gmt offset in minutes and convert to hours
		let gmtOffset = time.getTimezoneOffset() / 60
		// turn gmt offset into a string representing the timezone in its + or - gmt offset
		let timezoneOffsetString = `${gmtOffset > 0 ? '-':'+'} ${Math.abs(gmtOffset)}`;

	return {
		// minutes,
		hour,
		amPm,
		timezoneOffsetString
	}
}

// start the cron job
task.start();

client.login(TOKEN);