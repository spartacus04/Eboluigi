const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { Command } = require('discord.js-commando-it');

module.exports = class GlobalNewsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'world-news',
      aliases: ['global-news', 'reuters', 'worldnews'],
      group: 'other',
      memberName: 'world-news',
      description: 'Risponde con i titoli delle notizie recenti',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run(message) {
    const jsonQuotes = fs.readFileSync(
      'resources/quotes/news.json',
      'utf8'
    );
    const quoteArray = JSON.parse(jsonQuotes).quotes;

    const randomQuote =
      quoteArray[Math.floor(Math.random() * quoteArray.length)];
      
    message.channel.send({
      files: [{
          attachment: randomQuote.text,
          name: 'news.png'
      }]
    })
  }
};
