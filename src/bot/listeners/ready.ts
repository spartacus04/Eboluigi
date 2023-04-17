import { ActivityType } from 'discord.js';
import { logger } from '@logger';
import { client, Listener } from '@commandHandler';

const readyListener : Listener = {
	deferred: false,

	register: () => {
		client.once('ready', () => {
			logger.info('Ready!');
			client.user.setActivity('War Thunder', {
				type: ActivityType.Playing,
				url: 'https://youtu.be/dQw4w9WgXcQ',
			});
		});
	},
};

module.exports = readyListener;
