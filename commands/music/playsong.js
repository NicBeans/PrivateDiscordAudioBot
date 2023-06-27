const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('plays a song')
        .addChannelOption(option => option.setName('channel').setDescription('The voice channel to join').setRequired(true).addChannelTypes(ChannelType.GuildVoice)),
	async execute(interaction) {
		await interaction.reply('playing...');
	},
};