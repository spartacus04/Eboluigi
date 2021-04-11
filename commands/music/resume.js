const { Command } = require('discord.js-commando-it');

module.exports = class ResumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      aliases: ['resume-song', 'continue'],
      memberName: 'resume',
      group: 'music',
      description: 'riprendi la canzone in pausa',
      guildOnly: true
    });
  }

  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Bruh non stai riproducendo niente").catch(console.error);

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`Ho ripartito la canzone`).catch(console.error);
    }

    return message.reply("La musica non è in pausa").catch(console.error);
  }
};
