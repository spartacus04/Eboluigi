import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'kill-me-pls',
      aliases: ['kill-me-pls', 'killmepls', 'kill-me-please'],
      memberName: 'kill-me-pls',
      group: 'other',
      description: 'Invia un Meme Wholesome'
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    message.say("Ora conosco la tua posizione")
  }
};
