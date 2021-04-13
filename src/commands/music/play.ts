import { Client, CommandoMessage, Command } from "discord.js-commando-it";
import { MusicGuild } from "../../index";
import { Message, MessageEmbed, VoiceChannel } from 'discord.js';
import { SetInfo, TrackInfo } from "soundcloud-downloader/src/info";
const scdl = require("soundcloud-downloader").default;
//import scdl from 'soundcloud-downloader';
import * as https from 'https';
import { SearchResponseAll } from "soundcloud-downloader/src/search";
module.exports = class PlayCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'play',
      aliases: ['play-song', 'add'],
      memberName: 'play',
      group: 'music',
      description: 'Riproduce video o playlist da youtube',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'query',
          prompt: 'Quale canzone o playlist vorresti sentire?',
          type: 'string',
          validate: function(query : string) {
            return query.length > 0 && query.length < 200;
          }
        }
      ]
    });
  }

  // @ts-ignore
  async run(message : CommandoMessage, { query } : { query : string}) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.say('Devi essere in un canale plebeo');
      return;
    }

    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;


    //Riproduce le playlist

    if(scdl.isValidUrl(query) && query.includes("/sets/")){
      scdl.getSetInfo(query).then( (playlist : SetInfo) => {
        playlist.tracks.forEach((element : TrackInfo)=> {
          ((message.guild as any) as MusicGuild).musicData.queue.push(
            PlayCommand.constructSongObj(element.permalink_url, (element as TrackInfo), voiceChannel, message.member.user)
          );
        });

        if (((message.guild as any)as MusicGuild).musicData.isPlaying == false) {
          ((message.guild as any)as MusicGuild).musicData.isPlaying = true;
          return PlayCommand.playSong(((message.guild as any)as MusicGuild).musicData.queue, message);
        } else if (((message.guild as any)as MusicGuild).musicData.isPlaying == true) {
          message.say(
            `Playlist - :musical_note:  ${playlist.label_name} :musical_note: è stata aggiunta alla queue`
          );
          return;
        }

      }).catch(function(err : any) {
        console.log(err);
        return message.say("Qualcosa è andato storto");
      });
      return;
    }
    

    //Controlla se un url è da mobile
    if(mobileScRegex.test(query)){
      try {
        https.get(query, function (res) {
          if (res.statusCode == 302) {
            const play = require("../music/play");
            const playcommand = new play(message.client);
            return playcommand.run(message, { query : [res.headers.location]} );
          } else {
            return message.reply("Non ho trovato popon'cazzo").catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
        return message.reply("C'è stato un errore").catch(console.error);
      }
      return;
    }

    // Riproduce le canzoni
    if (scRegex.test(query)) {
      const video = await scdl.getInfo(query).catch(function() {
        message.say("C'è stato un problema col video dato");
        return;
      });
      ((message.guild as any)as MusicGuild).musicData.queue.push(
        PlayCommand.constructSongObj(query, (video as TrackInfo), voiceChannel, message.member.user)
      );
      if (
        ((message.guild as any)as MusicGuild).musicData.isPlaying == false ||
        typeof ((message.guild as any)as MusicGuild).musicData.isPlaying == 'undefined'
      ) {
        ((message.guild as any)as MusicGuild).musicData.isPlaying = true;
        return PlayCommand.playSong(((message.guild as any)as MusicGuild).musicData.queue, message);
      } else if (((message.guild as any)as MusicGuild).musicData.isPlaying == true) {
        message.say(`${(video as TrackInfo).title} aggiunta alla queue`);
        return;
      }
    }

    var seso = await scdl.search({query: query, resourceType : 'tracks', limit: 5}).then(async (videos : SearchResponseAll) => {
      if (videos.collection.length < 5 || !videos) {
        message.say(
          `Devi capire che ho dei problemi sii più specifico oppure esplodi`
        );
        return;
      }
      const vidNameArr = [];
      for (let i = 0; i < videos.collection.length; i++) {
        vidNameArr.push(`${i + 1}: ${(videos.collection[i] as TrackInfo).title}`);
      }
      vidNameArr.push('exit');
      
      const embed = new MessageEmbed()
        .setColor('#e9f931')
        .setTitle('Commenta scegliendo da 1 a 5')
        .addField('1', vidNameArr[0])
        .addField('2', vidNameArr[1])
        .addField('3', vidNameArr[2])
        .addField('4', vidNameArr[3])
        .addField('5', vidNameArr[4])
        .addField('Esci', '❌');
      var songEmbed : Message = await message.channel.send({ embed });
  
      songEmbed.react('1️⃣')
      .then(() => songEmbed.react('2️⃣'))
      .then(() => songEmbed.react('3️⃣'))
      .then(() => songEmbed.react('4️⃣'))
      .then(() => songEmbed.react('5️⃣'))
      .then(() => songEmbed.react('❌'));
  
      songEmbed.awaitReactions(
          function(reaction, user) {
            return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
          },
          {
            max: 1,
            time: 60000,
            errors: ['time']
          }
        )
        .then(function(collected) {
          const reaction = collected.first()
          var videoIndex;
          switch(reaction.emoji.name){
            case '❌':
              songEmbed.delete();
              return;
            case '1️⃣':
              videoIndex = 0;
              break;
            case '2️⃣':
              videoIndex = 1;
              break;
            case '3️⃣':
              videoIndex = 2;
              break;
            case '4️⃣':
              videoIndex = 3;
              break;
            case '5️⃣':
              videoIndex = 4;
              break;
          }
          
          ((message.guild as any)as MusicGuild).musicData.queue.push(
            PlayCommand.constructSongObj(
              (videos.collection[videoIndex] as TrackInfo).permalink_url,
              (videos.collection[videoIndex] as TrackInfo),
              voiceChannel,
              message.member.user
            )
          );
          if (((message.guild as any)as MusicGuild).musicData.isPlaying == false) {
            ((message.guild as any)as MusicGuild).musicData.isPlaying = true;
            if (songEmbed) {
              songEmbed.delete();
            }
            PlayCommand.playSong(((message.guild as any)as MusicGuild).musicData.queue, message);
          } else if (((message.guild as any)as MusicGuild).musicData.isPlaying == true) {
            if (songEmbed) {
              songEmbed.delete();
            }
            message.say(`${(videos.collection[videoIndex] as TrackInfo).title} aggiunta alla queue`);
            return;
          }
        })
        .catch(function(err) {
          if (songEmbed) {
            songEmbed.delete();
          }
          message.say(
            'Ti ho detto di darmi un numero da 1 a 5 oppure esci'
          );
          return;
        });
    }).catch(async function() {
      await message.say(
        "C'è stato un problema a cercare il brano bruh"
      );
      return;
    });
  }



  static playSong(queue : any, message : CommandoMessage) {
    const classThis = this; // use classThis instead of 'this' because of lexical scope below
    queue[0].voiceChannel
      .join()
      .then(function(connection : any) {
        scdl.download(queue[0].url).then((stream : any)=>{
        const dispatcher = connection
          .play(stream)
          .on('start', function() {
            ((message.guild as any)as MusicGuild).musicData.songDispatcher = dispatcher;
            dispatcher.setVolume(((message.guild as any)as MusicGuild).musicData.volume);
            const videoEmbed = new MessageEmbed()
              .setThumbnail(queue[0].thumbnail)
              .setColor('#e9f931')
              .addField('Ora riproducendo:', queue[0].title)
              .addField('Durata:', queue[0].duration)
              .setFooter(
                `Richiesta da ${queue[0].memberDisplayName}`,
                queue[0].memberAvatar
              );
            if (queue[1]) videoEmbed.addField('Prossima canzone:', queue[1].title);
            message.say(videoEmbed);
            ((message.guild as any)as MusicGuild).musicData.nowPlaying = queue[0];
            queue.shift();
            return;
          })
          .on('finish', function() {
            queue = ((message.guild as any)as MusicGuild).musicData.queue;
            if (queue.length >= 1) {
              classThis.playSong(queue, message);
              return;
            } else {
              ((message.guild as any)as MusicGuild).musicData.isPlaying = false;
              ((message.guild as any)as MusicGuild).musicData.nowPlaying = null;
              ((message.guild as any)as MusicGuild).musicData.songDispatcher = null;
              if (message.guild.me.voice.channel) {
                ((message.guild as any)as MusicGuild).me.voice.channel.leave();
                return;
              }
            }
          })
          .on('error', function(e : any) {
            message.say('non posso riprodurre quella canzone');
            console.error(e);
            ((message.guild as any)as MusicGuild).musicData.queue.length = 0;
            ((message.guild as any)as MusicGuild).musicData.isPlaying = false;
            ((message.guild as any)as MusicGuild).musicData.nowPlaying = null;
            ((message.guild as any)as MusicGuild).musicData.songDispatcher = null;
            ((message.guild as any)as MusicGuild).me.voice.channel.leave();
            return;
          });
        })
      })
      .catch(function() {
        message.say('Dammi i permessi sasso');
        ((message.guild as any)as MusicGuild).musicData.queue.length = 0;
        ((message.guild as any)as MusicGuild).musicData.isPlaying = false;
        ((message.guild as any)as MusicGuild).musicData.nowPlaying = null;
        ((message.guild as any)as MusicGuild).musicData.songDispatcher = null;
        if (message.guild.me.voice.channel) {
          message.guild.me.voice.channel.leave();
        }
        return;
      });
  }
  static constructSongObj(query : string, video : TrackInfo, voiceChannel : VoiceChannel, user : any) {
    let duration = this.formatDuration(video.duration);
    return {
      url: query,
      title: video.title,
      rawDuration: video.duration,
      duration,
      thumbnail: video.artwork_url,
      voiceChannel,
      memberDisplayName: user.username,
      memberAvatar: user.avatarURL('webp', false, 16)
    };
  }
  // prettier-ignore
  static formatDuration(durationObj : number) {
    let formattedDate = new Date(durationObj).toISOString().substr(11, 8)
    while(formattedDate.startsWith("00:")){
      formattedDate = formattedDate.substr(3);
    }
    return formattedDate;
  }
};
