import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";
import { MessageEmbed } from 'discord.js';
import * as fs from 'fs';

module.exports = class MotivationCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'motivation',
      aliases: ['motivational, motivation-quote'],
      group: 'other',
      memberName: 'motivation',
      description: 'ti dice cose motivanti(spero)'
    });
  }
  run(message : CommandoMessage) {
    // thanks to https://type.fit/api/quotes

    const jsonQuotes = fs.readFileSync(
      'resources/quotes/motivational.json',
      'utf8'
    );
    const quoteArray = JSON.parse(jsonQuotes).quotes;

    const randomQuote =
      quoteArray[Math.floor(Math.random() * quoteArray.length)];

    const quoteEmbed = new MessageEmbed()
      .setTitle(randomQuote.author)
      .setDescription(randomQuote.text)
      .setColor('#ff003c');
    return message.channel.send(quoteEmbed);
  }
};
