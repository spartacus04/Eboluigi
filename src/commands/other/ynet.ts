import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'ynet',
      aliases: ['ynet'],
      memberName: 'ynet',
      group: 'other',
      description: 'Invia ciuchino'
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    message.channel.send({
        files: [{
            attachment: "https://www.dropbox.com/s/4o4tndtc7uwxov0/ynet.jpg?dl=1",
            name: 'ynet.png'
        }]
    })
  }
};
