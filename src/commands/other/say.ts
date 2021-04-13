import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";
// @ts-ignore
import zalgo from 'to-zalgo';

module.exports = class SayCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'say',
      aliases: ['make-me-say', 'print', 'zalgo'],
      memberName: 'say',
      group: 'other',
      description: 'Ripeto cio che dici in modo maledetto',
      args: [
        {
          key: 'text',
          prompt: 'Cosa vuoi farmi ripetere?',
          type: 'string'
        }
      ]
    });
  }

  run(message : CommandoMessage, { text } : { text : string }) {
    if(text.toLowerCase() == "eboluigi lesbico"){
      return message.say("i tuoi insulti da comune mortale sono patetici");
    }
    else{
      return message.say(zalgo(text));
    }
  }
};
