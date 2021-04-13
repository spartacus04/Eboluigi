import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";

module.exports = class LoopCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'loop',
      group: 'music',
      memberName: 'loop',
      guildOnly: true,
      description: 'Loopa una canzone',
      args: [
        {
          key: 'numOfTimesToLoop',
          default: 1,
          type: 'integer',
          prompt: "Quante volte dev'essere ripetuta?"
        }
      ]
    });
  }

  run(message : CommandoMessage, { numOfTimesToLoop } : {numOfTimesToLoop : number}) {
    if (!((message.guild as any)as MusicGuild).musicData.isPlaying) {
      return message.say('Bruh non stai riproducendo niente');
    } else if (
      ((message.guild as any)as MusicGuild).musicData.isPlaying
    ) {
      return message.say('Non puoi farlo durante il trivia!');
    } else if (
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    ) {
      message.reply(
        `Devi essere nel mio stesso canale plebeo`
      );
      return;
    }

    for (let i = 0; i < numOfTimesToLoop; i++) {
      ((message.guild as any)as MusicGuild).musicData.queue.unshift(((message.guild as any)as MusicGuild).musicData.nowPlaying);
    }

    // prettier-ignore
    message.channel.send(
      `${((message.guild as any)as MusicGuild).musicData.nowPlaying.title} verrà loopato per ${numOfTimesToLoop} ${
        (numOfTimesToLoop == 1) ? 'volta' : 'volte'
      }`
    );
    return;
  }
};
