import { Command } from '../../config';
import { Message } from 'discord.js';
import fs from 'fs';

const newsCommand : Command = {
	name: 'world-news',
	aliases: ['worldnews'],
	description: 'Invia un meme sulle notizie',

	run(message : Message) {
		const quotes = JSON.parse(fs.readFileSync('resources/quotes/news.json', 'utf8')).quotes;

		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		return message.channel.send(randomQuote.text);
	},
};

module.exports = newsCommand;