const { Command } = require('discord.js-commando-it');

module.exports = class LoopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'loop',
      group: 'music',
      memberName: 'loop',
      guildOnly: true,
      description: 'Loopa una canzone'
    });
  }

  run(message ) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Bruh non stai riproducendo niente").catch(console.error);

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel.send(`Il loop è ora ${queue.loop ? "**attivo**" : "**spento**"}`).catch(console.error);
  }
};
