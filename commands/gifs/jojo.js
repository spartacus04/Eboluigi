const fs = require('fs');
const { Command } = require('../../discord.js-commando/src');

module.exports = class JojoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'jojo',
      aliases: ['jojo-gif', 'jojo-gifs'],
      group: 'gifs',
      memberName: 'jojo',
      description: 'Replies with a random jojo gif!',
      throttling: {
        usages: 20,
        duration: 8
      }
    });
  }

  run(message) {
    try {
      const linkArray = fs
        .readFileSync('resources/gifs/jojolinks.txt', 'utf8')
        .split('\n');
      const link = linkArray[Math.floor(Math.random() * linkArray.length)];
      return message.say(link);
    } catch (e) {
      message.say('Non ho trovato il gif <:tasbien:712705754678951987>');
      return console.error(e);
    }
  }
};