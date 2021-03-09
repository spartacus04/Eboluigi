const { Command } = require('../../discord.js-commando/src');

module.exports = class LeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      aliases: ['end', 'leave'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Lascia un canale vocale e cancella la queue'
    });
  }

  run(message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Bruh non stai riproducendo niente").catch(console.error);

    queue.songs = [];
    queue.connection.dispatcher.end();
  }
};
