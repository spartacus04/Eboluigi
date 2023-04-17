import fs from 'node:fs';
import { Message, EmbedBuilder } from 'discord.js';
import { Command } from '@commandHandler';

const vsauceCommand : Command = {
	name: 'vsauce',
	description: 'Invia un video di vsauce',

	run(message : Message) {
		const quotes = JSON.parse(fs.readFileSync('resources/quotes/vsauce.json', 'utf8')).quotes;

		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		const quoteEmbed = new EmbedBuilder()
			.setTitle(randomQuote.text)
			.setColor('#ff003c');

		return message.channel.send({ embeds : [ quoteEmbed ] });
	},
};

module.exports = vsauceCommand;