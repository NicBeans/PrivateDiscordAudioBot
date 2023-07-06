const { SlashCommandBuilder, ChannelType } = require("discord.js");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require("@discordjs/voice");
const youtubedl = require("youtube-dl-exec");

class Song {
  constructor(interaction) {
    this.interaction = interaction;
    this.connection = joinVoiceChannel({
      channelId: this.interaction.options.getChannel("channel").id,
      guildId: this.interaction.guild.id,
      adapterCreator: this.interaction.guild.voiceAdapterCreator,
    });
  }
  play(name, url) {
    // TODO
    const surl = name;
    const player = createAudioPlayer();
    this.interaction.reply("playing " + name);

    youtubedl(surl, {
      audioFormat: "mp3",
      output: "temp",
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    }).then(() => {
      const resource = createAudioResource("temp");
      this.connection.subscribe(player);
      player.play(resource);
    });
  }

  stop() {
    this.connection.destroy();
  }

  test() {}
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("plays a song")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The voice channel to join")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    )
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song to play")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const song = new Song(interaction);
      const songName = interaction.options.getString("song");
      song.play(songName, "bigben.mp3");
    } catch (error) {
      console.log("[ERROR]", error);
    }
  },
};

// module.exports = {
//   data: new SlashCommandBuilder().setName("stop").setDescription("stops"),
//   async execute(interaction) {
//     await interaction.reply("stopping...");
//     const connection = interaction.guild.voiceConnection;
//     connection.destroy();
//   },
// };
