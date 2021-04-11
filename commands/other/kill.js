const { Command } = require('discord.js-commando-it');
const randomPuppy = require('random-puppy');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kill-me-pls',
      aliases: ['kill-me-pls', 'killmepls', 'kill-me-please'],
      memberName: 'kill-me-pls',
      group: 'other',
      description: 'Invia un Meme Wholesome'
    });
  }

  run(message) {
    message.say("Ora conosco la tua posizione")
  }
};
