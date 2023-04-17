import dns from 'node:dns';
import { logger } from '@logger';
import { Listener } from '@commandHandler';

export const onReconnect = async (callback: () => void): Promise<void> => {
	new Promise<void>(resolve => {
		dns.resolve('discord.com', (err: Error) => {
			if (err) {
				setTimeout(() => {
					onReconnect(callback).then(resolve);
				}, 5000);
			}
			else {
				callback();
				resolve();
			}
		});
	});
};

export const onDisconnect = async (callback: () => void): Promise<void> => {
	new Promise<void>(resolve => {
		dns.resolve('discord.com', (err: Error) => {
			if (err) {
				callback();
				resolve();
			}
			else {
				setTimeout(() => {
					onDisconnect(callback).then(resolve);
				}, 5000);
			}
		});
	});
};

const disconnectListener : Listener = {
	deferred: false,

	register: () => {
		onDisconnect(() => {
			logger.error('Disconnected from discord, awaiting reconnect');
			onReconnect(() => {
				logger.info('Reconnected to discord, restarting...');
				process.exit(1);
			});
		});
	},
};

module.exports = disconnectListener;