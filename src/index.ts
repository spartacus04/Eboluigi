/* eslint-disable no-empty */
import {  Structures, Collection, TextChannel } from 'discord.js';
import { Client, CommandoClient, CommandoGuild } from 'discord.js-commando-it';
import * as path from 'path';

export class MusicGuild extends CommandoGuild {
  constructor(client : Client, data : any) {
    super(client, data);
    this.musicData = {
      queue: [],
      isPlaying: false,
      nowPlaying: null,
      songDispatcher: null,
      volume: 1
    };
  }
  public musicData : any;
}

Structures.extend('Guild', function() {
  return MusicGuild;
});

const client = new CommandoClient({
  commandPrefix: "l.",
  owner: "465954478852669460" // value comes from config.json
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['music', 'Musica'],
    ['gifs', 'Gif'],
    ['other', 'Altro']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    eval: false,
    prefix: false,
    commandState: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));


const cooldowns = new Collection();
const escapeRegex = (str : string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity(`War Thunder`, {
    type: 'PLAYING',
    url: 'https://youtu.be/dQw4w9WgXcQ'
  });
});

client.on('message', message => {
	
  if(message.content.toLowerCase() == "eboluigi lesbico"){
    message.channel.send("No tu");
  }
});

client.on('voiceStateUpdate', async (___, newState) => {
  if (
    newState.member.user.bot &&
    !newState.channelID &&
    ((newState.guild as any)as MusicGuild).musicData.songDispatcher &&
    newState.member.user.id == client.user.id
  ) {
    ((newState.guild as any)as MusicGuild).musicData.queue.length = 0;
    ((newState.guild as any)as MusicGuild).musicData.songDispatcher.end();
    return;
  }
  if (
    newState.member.user.bot &&
    newState.channelID &&
    newState.member.user.id == client.user.id &&
    !newState.selfDeaf
  ) {
    newState.setSelfDeaf(true);
  }
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'spam-nuovi-arrivati'); // change this to the channel name you want to send the greeting to
  if (!channel) return;
  (channel as TextChannel).send(`Welcome ${member}!`);
});

client.login(process.env.token);