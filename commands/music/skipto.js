const { Command } = require('discord.js-commando-it');

module.exports = class SkipToCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipto',
      memberName: 'skipto',
      group: 'music',
      description:
        'Salta fino a una canzone nella queue',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt:
            "Qual'è il numero della canzone",
          type: 'integer'
        }
      ]
    });
  }

  run(message, { songNumber }) {

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (songNumber > queue.songs.length)
      return message.reply(`La queue è lunga solo ${queue.songs.length} elementi`).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < songNumber - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(songNumber - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ skipped ${songNumber - 1} songs`).catch(console.error);
  }
};
