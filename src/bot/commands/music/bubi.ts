import { Message } from 'discord.js';
import { logger } from '@logger';
import { Command } from '@commandHandler';

const davidGnomoCommand: Command = {
	name: 'bubi',
	description: 'Riproduce Bubi',

	async run(message: Message) {
		const playCommand = ((await import('./play')) as any).default as Command;
		logger.info('Executing command play with parameter query https://soundcloud.com/h3diablo/bubiiiii-1');
		playCommand.run(message, { query: 'https://soundcloud.com/h3diablo/bubiiiii-1' });
	},
};

module.exports = davidGnomoCommand;
