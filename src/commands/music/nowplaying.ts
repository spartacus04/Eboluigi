import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";
import { MessageEmbed } from 'discord.js';


module.exports = class NowPlayingCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'nowplaying',
      group: 'music',
      memberName: 'nowplaying',
      aliases: ['np', 'currently-playing', 'now-playing'],
      guildOnly: true,
      description: 'Dice la canzone che stai riproducendo'
    });
  }

  run(message : CommandoMessage) {
    if (
      (!((message.guild as any)as MusicGuild).musicData.isPlaying &&
        !((message.guild as any)as MusicGuild).musicData.nowPlaying)
    ) {
      return message.say('Bruh non stai riproducendo niente');
    }

    const video = ((message.guild as any)as MusicGuild).musicData.nowPlaying;
    let description;
    if (video.duration == 'Live Stream') {
      description = 'Live Stream';
    } else {
      description = NowPlayingCommand.playbackBar(message, video);
    }

    const videoEmbed = new MessageEmbed()
      .setThumbnail(video.thumbnail)
      .setColor('#e9f931')
      .setTitle(video.title)
      .setDescription(description);
    message.channel.send(videoEmbed);
    return;
  }
  static playbackBar(message : CommandoMessage, video : any) {
    const totalDurationObj = video.rawDuration;
    const totalDurationFormatted = NowPlayingCommand.formatDuration(totalDurationObj, 3);

    const passedTimeInMS = ((message.guild as any)as MusicGuild).musicData.songDispatcher.streamTime;
    
    const passedTimeFormatted = NowPlayingCommand.formatDuration(passedTimeInMS, totalDurationFormatted.length);
    
    const playBackBarLocation = Math.round(
      (passedTimeInMS / (totalDurationObj)) * 10
    );
    let playBack = '';
    for (let i = 1; i < 21; i++) {
      if (playBackBarLocation == 0) {
        playBack = ':musical_note:▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
        break;
      } else if (playBackBarLocation == 10) {
        playBack = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬:musical_note:';
        break;
      } else if (i == playBackBarLocation * 2) {
        playBack = playBack + ':musical_note:';
      } else {
        playBack = playBack + '▬';
      }
    }
    playBack = `${passedTimeFormatted}  ${playBack}  ${totalDurationFormatted}`;
    return playBack;
  }
  // prettier-ignore
  static formatDuration(durationObj : number, minCharacters : number) {
    let formattedDate = new Date(durationObj).toISOString().substr(11, 8)
    while(formattedDate.startsWith("00:") && formattedDate.length > minCharacters){
      formattedDate = formattedDate.substr(3);
    }
    return formattedDate;
  }
};
