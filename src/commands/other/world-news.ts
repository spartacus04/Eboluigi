import { CommandoMessage, Command, CommandoClient } from "discord.js-commando-it";
import * as  fs from 'fs';


module.exports = class GlobalNewsCommand extends Command {
  constructor(client : CommandoClient) {
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

  //@ts-ignore
  run(message : CommandoMessage) {
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
