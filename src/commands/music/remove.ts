import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";

module.exports = class RemoveSongCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'remove',
      memberName: 'remove',
      group: 'music',
      description: 'Rimuove una canzone dalla queue',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt: 'Quale numero vuoi rimuovere dalla queue?',
          type: 'integer'
        }
      ]
    });
  }
  run(message : CommandoMessage, { songNumber } : {songNumber : number}) {
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

    ((message.guild as any)as MusicGuild).musicData.queue.splice(songNumber - 1, 1);
    return message.say(`Rimossa la canzone numero ${songNumber} dalla queue`);
  }
};
