const { Command } = require('../../discord.js-commando/src');

module.exports = class VolumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      aliases: ['change-volume'],
      group: 'music',
      memberName: 'volume',
      guildOnly: true,
      description: 'Volume',
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'wantedVolume',
          prompt: 'A che volume?',
          type: 'float'
        }
      ]
    });
  }

  run(message, { wantedVolume }) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Bruh non stai riproducendo niente").catch(console.error);

    if (!wantedVolume) return message.reply(`Il volume è a ${queue.volume / 100}`).catch(console.error);
    if (isNaN(wantedVolume)) return message.reply("Please use a number to set volume.").catch(console.error);

    queue.volume = wantedVolume;
    queue.connection.dispatcher.setVolumeLogarithmic(wantedVolume);

    return queue.textChannel.send(`Ho messo il volume a ${wantedVolume}`).catch(console.error);
  }
};
