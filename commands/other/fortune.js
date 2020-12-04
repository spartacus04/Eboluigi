const fetch = require('node-fetch');
const { Command } = require('../../discord.js-commando/src');
const { MessageEmbed } = require('discord.js');

module.exports = class FortuneCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'fortune',
      aliases: ['fortune-cookie'],
      group: 'other',
      memberName: 'fortune',
      description: 'Risponde come un biscotto della fortuna',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run(message) {
    message.say("Il biscotto della fortuna dice che sei gay");
  }
};
