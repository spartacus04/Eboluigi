import { logger } from '@logger';
import { DISCORD_TOKEN } from '@config';
import { client } from '@commandHandler';
import { forEachParallel } from './util';

client.commands = [];

(async () => {
	logger.info('Starting...');
	// Initialize Commands

	await client.fetchGroups().forEach(async group => {
		await client.loadGroup(group);
	});

	await client.rewriteReadme()

	logger.info('Fully loaded commands');

	// Initialize Listeners
	const listeners = client.fetchListeners();

	await forEachParallel(listeners, async listenerFile => {
		await client.loadListener(listenerFile);
	});

	logger.info('Fully loaded listeners');

	client.login(DISCORD_TOKEN);
})();
