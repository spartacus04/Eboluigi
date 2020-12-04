const { Command } = require('../../discord.js-commando/src');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nigga',
      aliases: ['nigga'],
      memberName: 'nigga',
      group: 'other',
      description: 'Invia un N-Word Pass'
    });
  }

  run(message) {
    message.say('Eboluigi dice: il razzismo è più divertente quando non hai un n-word pass');
  }
};
