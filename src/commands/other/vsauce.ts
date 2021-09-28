import { Command } from '../../config';
import { Message, MessageEmbed } from 'discord.js';
import fs from 'fs';

const vsauceCommand : Command = {
	name: 'vsauce',
	description: 'Invia un video di vsauce',

	run(message : Message) {
		const quotes = JSON.parse(fs.readFileSync('resources/quotes/news.json', 'utf8')).quotes;

		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		const quoteEmbed = new MessageEmbed()
			.setTitle(randomQuote.text)
			.setColor('#ff003c');

		return message.channel.send({ embeds : [ quoteEmbed ] });
	},
};

module.exports = vsauceCommand;