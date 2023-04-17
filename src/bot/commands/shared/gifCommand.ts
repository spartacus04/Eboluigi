import { Message, TextChannel } from 'discord.js';
import { logger } from '@logger';
import { TENOR_KEY } from '@config';

export const gifCommand = async (message: Message, query: string) => {
	await (<TextChannel>message.channel).sendTyping();
	try {
		const res = await fetch(`https://api.tenor.com/v1/random?key=${TENOR_KEY}&q=${query}&limit=1`);
		const data = (await res.json()) as any;
		logger.verbose(data);
		await (<TextChannel>message.channel).send(data.results[0].url);
	}
	catch (err) {
		(<TextChannel>message.channel).send('Non ho trovato una gif <:tasbien:712705754678951987>');
		logger.error(err);
	}
};