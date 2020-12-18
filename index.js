/* eslint-disable no-empty */
const { CommandoClient } = require('./discord.js-commando/src');
const { Structures } = require('discord.js');
const path = require('path');
const randomPuppy = require('random-puppy');

Structures.extend('Guild', function(Guild) {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        songDispatcher: null,
        volume: 1
      };
      this.triviaData = {
        isTriviaRunning: false,
        wasTriviaEndCalled: false,
        triviaQueue: [],
        triviaScore: new Map()
      };
    }
  }
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
    ['other', 'Altro'],
    ['guild', 'Comandi del server']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    eval: false,
    prefix: false,
    commandState: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity(`War Thunder`, {
    type: 'PLAYING',
    url: 'https://youtu.be/dQw4w9WgXcQ'
  });
});

client.on('message', message => {
	if(message.channel.id == "712644431622438922"){
		if(message.member.id != "711871380622409730"){
			message.channel.send("Bruh");
			message.delete();
		}
  }
  else{
    if(message.content == "Eboluigi lesbico" || message.content == "eboluigi lesbico"){
      message.channel.send("No tu");
    }
  }
});

client.on('voiceStateUpdate', async (___, newState) => {
  if (
    newState.member.user.bot &&
    !newState.channelID &&
    newState.guild.musicData.songDispatcher &&
    newState.member.user.id == client.user.id
  ) {
    newState.guild.musicData.queue.length = 0;
    newState.guild.musicData.songDispatcher.end();
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
  channel.send(`Welcome ${member}!`);
});

//client.login(process.env.token);
client.login("Nzg0MTM4ODM3Mjg2NzE1NDIy.X8k8Mw._L_cGY_5SRBPN3nK-imy7HdK4lU");