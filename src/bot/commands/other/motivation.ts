import fs from 'node:fs';
import { Message, EmbedBuilder } from 'discord.js';
import { logger } from '@logger';
import { Command } from '@commandHandler';

const motivationCommand : Command = {
	name: 'motivation',
	aliases: ['motivational', 'motivation-quote'],
	description: 'Risponde con una frase motivante (spero)',

	run(message : Message) {
		const quotes = JSON.parse(fs.readFileSync('resources/quotes/motivational.json', 'utf8')).quotes;

		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		logger.info(`sending quote: ${randomQuote.author}`);

		const quoteEmbed = new EmbedBuilder()
			.setTitle(randomQuote.author)
			.setDescription(randomQuote.text)
			.setColor('#ff003c');

		return message.channel.send({ embeds : [ quoteEmbed ] });
	},
};

module.exports = motivationCommand;