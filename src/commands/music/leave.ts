import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";

module.exports = class LeaveCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'leave',
      aliases: ['end', 'stop', 'zittatroiaccia', 'zitta-troiaccia'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Lascia un canale vocale e cancella la queue'
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Devi essere in un canale plebeo');
      return;
    } else if (
      typeof (((message.guild as any)as MusicGuild).musicData.songDispatcher as any) == 'undefined' ||
      ((message.guild as any)as MusicGuild).musicData.songDispatcher == null
    ) {
      message.reply('Bruh non stai riproducendo niente');
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `Devi essere nel mio stesso canale plebeo`
      );
      return;
    } else if (!((message.guild as any)as MusicGuild).musicData.queue) {
      message.reply('Bruh non stai riproducendo niente');
      return;
    } else if (((message.guild as any)as MusicGuild).musicData.songDispatcher.paused) {
      ((message.guild as any)as MusicGuild).musicData.songDispatcher.resume();
      ((message.guild as any)as MusicGuild).musicData.queue.length = 0;
      setTimeout(() => {
        ((message.guild as any)as MusicGuild).musicData.songDispatcher.end();
      }, 100);
      return;
    } else {
      ((message.guild as any)as MusicGuild).musicData.queue.length = 0;
      ((message.guild as any)as MusicGuild).musicData.songDispatcher.end();
      return;
    }
  }
};
