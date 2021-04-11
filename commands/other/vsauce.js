const { Command } = require('discord.js-commando-it');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class MotivationCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'vsauce',
      aliases: ['vsauce, sauce'],
      group: 'other',
      memberName: 'vsauce',
      description: 'ti invia un video di vsauce'
    });
  }
  run(message) {
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
