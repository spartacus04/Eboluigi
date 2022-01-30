import { Command, TENOR_KEY } from '../../config';
import { Message } from 'discord.js';
import fetch from 'node-fetch';
import { logger } from '../../logger';

const catCommand : Command = {
	name: 'cat',
	description: 'Invia un immagine di un cane',

	async run(message : Message) {
		try{
			await message.channel.sendTyping();
			const res = await fetch(`https://api.tenor.com/v1/random?key=${TENOR_KEY}&q=dog&limit=1`);
			const data = await res.json() as any;
			logger.verbose(data);
			await message.channel.send(data.results[0].url);
		}
		catch(err) {
			message.channel.send('Bruh non ho trovato un gatto');
			logger.error(err);
		}
	},
};

module.exports = catCommand;