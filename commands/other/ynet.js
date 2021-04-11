const { Command } = require('discord.js-commando-it');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ynet',
      aliases: ['ynet'],
      memberName: 'ynet',
      group: 'other',
      description: 'Invia ciuchino'
    });
  }

  run(message) {
    message.channel.send({
        files: [{
            attachment: "https://www.dropbox.com/s/4o4tndtc7uwxov0/ynet.jpg?dl=1",
            name: 'ynet.png'
        }]
    })
  }
};
