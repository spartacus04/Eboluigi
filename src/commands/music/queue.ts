import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";
import { MessageEmbed } from 'discord.js';

module.exports = class QueueCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'queue',
      aliases: ['song-list', 'next-songs'],
      group: 'music',
      memberName: 'queue',
      guildOnly: true,
      description: 'Mostra le canzoni in coda'
    });
  }

  run(message : CommandoMessage) {
    if (((message.guild as any)as MusicGuild).musicData.queue.length == 0)
      return message.say('Bruh non stai riproducendo niente');
    const titleArray : any[] = [];
    /* eslint-disable */
    // display only first 10 items in queue
    ((message.guild as any)as MusicGuild).musicData.queue.slice(0, 10).forEach((obj : any) => {
      titleArray.push(obj.title);
    });
    /* eslint-enable */
    var queueEmbed = new MessageEmbed()
      .setColor('#ff7373')
      .setTitle(`Queue - ${((message.guild as any)as MusicGuild).musicData.queue.length} oggetti`);
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
    }
    return message.say(queueEmbed);
  }
};
