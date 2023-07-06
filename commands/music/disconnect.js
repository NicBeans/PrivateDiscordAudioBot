const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { Song } = require("./playsong.js");

// const connection = getVoiceConnection(myVoiceChannel.guild.id);

module.exports = {
  data: new SlashCommandBuilder().setName("stop").setDescription("stops"),
  async execute(interaction) {
    await interaction.reply("stopping...");
    // const connection = interaction.guild.voiceConnection;
	// console.log(interaction);
    // connection.destroy();
  },

};
