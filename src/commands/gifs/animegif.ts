import { Command, TENOR_KEY } from '../../config';
import fetch from 'node-fetch';
import { Message } from 'discord.js';
import { logger } from '../../logger';

const animeGifCommand : Command = {
	name: 'animegif',
	aliases: ['anime-gif', 'anime-gifs'],
	description: 'Invia una gif di saitama',

	async run(message : Message) {
		await message.channel.sendTyping();
		try {
			const res = await fetch(`https://api.tenor.com/v1/random?key=${TENOR_KEY}&q=saitama&limit=1`);
			const data = await res.json();
			logger.verbose(data);
			await message.channel.send(data.results[0].url);
		}
		catch (err) {
			message.channel.send('Non ho trovato una gif <:tasbien:712705754678951987>');
			logger.error(err);
		}
	},
};

module.exports = animeGifCommand;