import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";
import { MessageEmbed } from 'discord.js';


module.exports = class ShuffleQueueCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'shuffle',
      memberName: 'shuffle',
      group: 'music',
      description: 'Riproduzione casuale',
      guildOnly: true
    });
  }
  run(message : CommandoMessage) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Devi essere in un canale plebeo');

    if (
      typeof ((message.guild as any)as MusicGuild).musicData.songDispatcher == 'undefined' ||
      ((message.guild as any)as MusicGuild).musicData.songDispatcher == null
    ) {
      return message.reply('Bruh non stai riproducendo niente');
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `Devi essere nel mio stesso canale plebeo`
      );
      return;
    }

    if (((message.guild as any)as MusicGuild).musicData.queue.length < 1)
      return message.say('Bruh non stai riproducendo niente');

    shuffleQueue(((message.guild as any)as MusicGuild).musicData.queue);

    const titleArray : any[] = [];
    ((message.guild as any)as MusicGuild).musicData.queue.slice(0, 10).forEach((obj : any) => {
      titleArray.push(obj.title);
    });
    var numOfEmbedFields = 10;
    if (titleArray.length < 10) numOfEmbedFields = titleArray.length;
    var queueEmbed = new MessageEmbed()
      .setColor('#ff7373')
      .setTitle('Nuova Queue');
    for (let i = 0; i < numOfEmbedFields; i++) {
      queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
    }
    return message.say(queueEmbed);
  }
};

function shuffleQueue(queue : any) {
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
}
