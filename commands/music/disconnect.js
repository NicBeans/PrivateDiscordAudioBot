const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('stops'),
	async execute(interaction) {
		// nothing;
	},
};