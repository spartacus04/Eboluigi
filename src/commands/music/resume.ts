import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";

module.exports = class ResumeCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'resume',
      aliases: ['resume-song', 'continue'],
      memberName: 'resume',
      group: 'music',
      description: 'riprendi la canzone in pausa',
      guildOnly: true
    });
  }

  run(message : CommandoMessage) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Devi essere in un canale plebeo');

    if (
      typeof ((message.guild as any)as MusicGuild).musicData.songDispatcher == 'undefined' ||
      ((message.guild as any)as MusicGuild).musicData.songDispatcher === null
    ) {
      return message.reply('Bruh non stai riproducendo niente');
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `Devi essere nel mio stesso canale plebeo`
      );
      return;
    }

    message.say('Canzone ripresa :play_pause:');

    ((message.guild as any)as MusicGuild).musicData.songDispatcher.resume();
    
  }
};
