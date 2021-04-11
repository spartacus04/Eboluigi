const { Command } = require('discord.js-commando-it');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause',
      aliases: ['pause-song', 'hold'],
      memberName: 'pause',
      group: 'music',
      description: 'Mette in pausa',
      guildOnly: true
    });
  }

  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Bruh non stai riproducendo niente").catch(console.error);

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`Ho messo in pausa`).catch(console.error);
    }
  }
};
