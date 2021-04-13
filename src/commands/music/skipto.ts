import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";

module.exports = class SkipToCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'skipto',
      memberName: 'skipto',
      group: 'music',
      description:
        'Salta fino a una canzone nella queue',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt:
            "Qual'è il numero della canzone",
          type: 'integer'
        }
      ]
    });
  }

  run(message : CommandoMessage, { songNumber } : { songNumber : number }) {
    if (songNumber < 1 && songNumber >= ((message.guild as any)as MusicGuild).musicData.queue.length) {
      return message.reply('Inserisci un numero valido');
    }
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

    if (((message.guild as any)as MusicGuild).musicData.queue < 1)
      return message.say('Bruh non stai riproducendo niente');

    ((message.guild as any)as MusicGuild).musicData.queue.splice(0, songNumber - 1);
    ((message.guild as any)as MusicGuild).musicData.songDispatcher.end();
    return;
  }
};
