import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";


module.exports = class LeaveCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'earrape',
      aliases: ['earrape'],
      group: 'music',
      memberName: 'earrape',
      guildOnly: true,
      description: 'EARRAPE'
    });
  }

  run(message : CommandoMessage) {
    try{
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Devi essere in un canale plebeo');

        if (
            typeof (((message.guild as any)as MusicGuild).musicData.songDispatcher as any) == 'undefined' ||
            ((message.guild as any)as MusicGuild).musicData.songDispatcher == null
        ) {
            return message.reply('Bruh non stai riproducendo niente');
        } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
            message.reply(
              `Devi essere nel mio stesso canale plebeo`
            );
            return;
        }
        

        const previousvolume = ((message.guild as any)as MusicGuild).musicData.volume * 2;
        const volume = require("./volume");
        const volumecommand = new volume(message.client);
        volumecommand.run(message, { wantedVolume : 69420} );
        setTimeout(function(){ volumecommand.run(message, { wantedVolume : previousvolume} ); }, 3000);
      }
      catch(e){
        console.error(e);
      }
  }
};
