import { Listener } from '../config';
import { logger } from '../logger';
import { onDisconnect, onReconnect } from '../util';

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