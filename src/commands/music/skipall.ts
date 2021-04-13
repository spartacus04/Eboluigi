import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";

module.exports = class SkipAllCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'skipall',
      aliases: ['skip-all'],
      memberName: 'skipall',
      group: 'music',
      description: 'Salta tutte le canzoni',
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
    if (!((message.guild as any)as MusicGuild).musicData.queue)
      return message.say('Bruh non stai riproducendo niente');
      ((message.guild as any)as MusicGuild).musicData.queue.length = 0; // clear queue
      ((message.guild as any)as MusicGuild).musicData.songDispatcher.end();
    return;
  }
};
