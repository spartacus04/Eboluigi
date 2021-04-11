const { play } = require("./include/play");
const scdl = require("soundcloud-downloader").default;
const https = require("https");
const SOUNDCLOUD_CLIENT_ID = process.env.scAPI;
const { Command } = require('discord.js-commando-it');
const { message } = require('discord.js');

module.exports = class PlayCommand extends Command{
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['play-song', 'add'],
      memberName: 'play',
      group: 'music',
      description: 'Riproduce video o playlist da soundcloud',
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
          validate: function(query) {
            return query.length > 0 && query.length < 200;
          }
        }
      ]
    });
  }

  async run(message, { query }) {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply("Devi essere in un canale plebeo").catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply('Devi essere nel mio stesso canale plebeo').catch(console.error);


    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Dammi i permessi sasso");
    if (!permissions.has("SPEAK"))
      return message.reply("Dammi i permessi sasso");

    const search = query;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
    const url = query;


    if (scdl.isValidUrl(url) && url.includes("/sets/")) {
      return message.say("Non posso ancora riprodurre le playlist");
    }

    if (mobileScRegex.test(url)) {
      try {
        https.get(url, function (res) {
          if (res.statusCode == "302") {
            const play = require("../music/play");
            const playcommand = new play(message.client);
            return playcommand.run(message, { query : [res.headers.location]} );
          } else {
            return message.reply("Non ho trovato popon'cazzo").catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
      return message.reply("Cerco cose che mi hai inviato").catch(console.error);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;

    if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: Math.ceil(trackInfo.duration / 1000)
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(`${song.title} aggiunta alla queue`)
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send("dammi i permessi sasso").catch(console.error);
    }
  }
};
