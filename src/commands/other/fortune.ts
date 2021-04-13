import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";

module.exports = class FortuneCommand extends Command {
  constructor(client : CommandoClient) {
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

  // @ts-ignore
  run(message : CommandoMessage) {
    message.say("Il biscotto della fortuna dice che sei gay");
  }
};
