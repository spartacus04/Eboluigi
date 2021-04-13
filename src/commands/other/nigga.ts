import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";


module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'nigga',
      aliases: ['nigga'],
      memberName: 'nigga',
      group: 'other',
      description: 'Invia un N-Word Pass'
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    message.say('Eboluigi dice: il razzismo è più divertente quando non hai un n-word pass');
  }
};
