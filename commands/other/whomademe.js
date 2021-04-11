const { Command } = require('discord.js-commando-it');

module.exports = class WhoMadeMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'whomademe',
      aliases: ['bot-maker', 'bot-creator'],
      memberName: 'whomademe',
      group: 'other',
      description: "Risponde con il nome del creatore"
    });
  }

  run(message) {
    message.say(
      'Mio padre @spartacus04#9422 mi ha creato con :heart: Altre info a https://github.com/spartacus04/Eboluigi'
    );
  }
};
