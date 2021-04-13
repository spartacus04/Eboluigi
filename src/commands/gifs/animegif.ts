import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando-it';
import fetch from 'node-fetch';
const tenorAPI = process.env.tenorAPI;

module.exports = class AnimegifCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'animegif',
      group: 'gifs',
      aliases: ['anime-gif', 'anime-gifs'],
      memberName: 'animegif',
      description:
        'io ti do una gif fine sos',
      throttling: {
        usages: 10,
        duration: 4
      }
    });
  }

  // @ts-ignore
  run(message : CommandoMessage) {
    fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=saitama&limit=1`)
      .then(res => res.json())
      .then(json => message.say(json.results[0].url))
      .catch(err => {
        message.say('Non ho trovato una gif <:tasbien:712705754678951987>');
        console.error(err);
        return;
      });
  }
};
