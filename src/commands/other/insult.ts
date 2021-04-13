import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

module.exports = class InsultCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'insult',
      group: 'other',
      memberName: 'insult',
      description: 'Crea un isulto',
      throttling: {
        usages: 1,
        duration: 6
      }
    });
  }

  // @ts-ignore
  run(message : CommandoMessage) {
    fetch('https://evilinsult.com/generate_insult.php?lang=it&type=json')
      .then(res => res.json())
      .then(json => {
        const embed = new MessageEmbed()
          .setColor('#E41032')
          .setTitle('Insulto')
          .setDescription(json.insult)
          .setURL('https://evilinsult.com');
        return message.say(embed);
      })
      .catch(err => {
        message.say('Bruh non va :sob:');
        return console.error(err);
      });
  }
};
