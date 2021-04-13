import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
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

  // @ts-ignore
  run(message : CommandoMessage, { min, max } : { min : number, max : number}) {
    message.say("69420 lol");
  }
};
