
const fs = require('fs');
const { Command } = require('discord.js-commando-it');

module.exports = class JojoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tpose',
      aliases: ['tpose'],
      group: 'gifs',
      memberName: 'tpose',
      description: 'Replies with a tpose',
      throttling: {
        usages: 20,
        duration: 8
      }
    });
  }

  run(message) {
    try {
      const linkArray = fs
        .readFileSync('resources/quotes/tpose.txt', 'utf8')
        .split('\n');
      const link = linkArray[Math.floor(Math.random() * linkArray.length)];
      return message.say(link);
    } catch (e) {
      message.say('Non ho trovato il gif <:tasbien:712705754678951987>');
      return console.error(e);
    }
  }
};