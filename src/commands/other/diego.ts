import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'diego',
      aliases: ['diego'],
      memberName: 'diego',
      group: 'other',
      description: 'Invia un diego'
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    message.channel.send({
        files: [{
            attachment: "https://raw.githubusercontent.com/spartacus04/Eboluigi/master/resources/images/diego.jpg",
            name: 'diego.png'
        }]
    })
  }
};
