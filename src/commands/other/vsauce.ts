import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";

import * as  fs from 'fs';

module.exports = class MotivationCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'vsauce',
      aliases: ['vsauce, sauce'],
      group: 'other',
      memberName: 'vsauce',
      description: 'ti invia un video di vsauce'
    });
  }
  run(message : CommandoMessage) {
    // thanks to https://type.fit/api/quotes

    const jsonQuotes = fs.readFileSync(
      'resources/quotes/vsauce.json',
      'utf8'
    );
    const quoteArray = JSON.parse(jsonQuotes).quotes;

    const randomQuote =
      quoteArray[Math.floor(Math.random() * quoteArray.length)];
    return message.channel.send(randomQuote.text);
  }
};
