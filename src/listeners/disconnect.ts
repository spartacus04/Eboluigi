import { logger } from '../logger';
import { onDisconnect, onReconnect } from '../util';

onDisconnect(() => {
	logger.error('Disconnected from discord, awaiting reconnect');
	onReconnect(() => {
		logger.info('Reconnected to discord, restarting...');
		process.exit(1);
	});
});