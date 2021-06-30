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
            attachment: "https://raw.githubusercontent.com/spartacus04/Eboluigi/master/resources/images/ynet.jpg",
            name: 'ynet.png'
        }]
    })
  }
};
