const { MessageEmbed } = require('discord.js');
const { Command } = require('../../discord.js-commando/src');

module.exports = class NowPlayingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nowplaying',
      group: 'music',
      memberName: 'nowplaying',
      aliases: ['np', 'currently-playing', 'now-playing'],
      guildOnly: true,
      description: 'Dice la canzone che stai riproducendo'
    });
  }

  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Bruh non stai riproducendo niente").catch(console.error);

    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle("Now playing")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A")
      .setAuthor(message.client.user.username);

    if (song.duration > 0) {
      nowPlaying.addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) + "/" + (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );
      nowPlaying.setFooter("Tempo rimanente: " + new Date(left * 1000).toISOString().substr(11, 8));
    }

    return message.channel.send(nowPlaying);
  }
};
