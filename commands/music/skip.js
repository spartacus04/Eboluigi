const { Command } = require('../../discord.js-commando/src');

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['skip-song', 'advance-song'],
      memberName: 'skip',
      group: 'music',
      description: 'Salta la canzone',
      guildOnly: true
    });
  }

  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("Bruh non stai riproducendo niente").catch(console.error);

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`salto la canzone`).catch(console.error);
  }
};
