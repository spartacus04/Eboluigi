const { Command } = require('../../discord.js-commando/src');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'random',
      aliases: ['random-number', 'number-between'],
      memberName: 'random',
      group: 'other',
      description: 'Crea un numero a caso tra i numeri dati',
      args: [
        {
          key: 'min',
          prompt: 'Numero minimo?',
          type: 'integer'
        },
        {
          key: 'max',
          prompt: 'numero massimo?',
          type: 'integer'
        }
      ]
    });
  }

  run(message, { min, max }) {
    message.say("69420 lol");
  }
};
