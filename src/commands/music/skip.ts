import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";

module.exports = class SkipCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'skip',
      aliases: ['skip-song', 'advance-song'],
      memberName: 'skip',
      group: 'music',
      description: 'Salta la canzone',
      guildOnly: true
    });
  }

  run(message : CommandoMessage) {
    const voiceChannel = message.member.voice.channel;
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
    ((message.guild as any)as MusicGuild).musicData.songDispatcher.end();
  }
};
