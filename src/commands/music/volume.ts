import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";

module.exports = class VolumeCommand extends Command {
  constructor(client : Client) {
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

  run(message : CommandoMessage, { wantedVolume } : {wantedVolume : number}) {
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
    const volume = wantedVolume / 2;
    ((message.guild as any)as MusicGuild).musicData.volume = volume;
    ((message.guild as any)as MusicGuild).musicData.songDispatcher.setVolume(volume);
    message.say(`Ho messo il volume a: ${wantedVolume}`);
  }
};
