import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import { DISCORD_TOKEN, client } from './config';
import path from 'path';
import { forEachParallel, getGroups, loadGroup } from './util';
import { logger } from './logger';

client.commands = [];

const init = async () => {
	logger.info('Starting...');
	// Initialize Commands
	const groups = getGroups();

	await groups.forEach(async group => {
		await loadGroup(group);
	});

	logger.info('Fully loaded commands');

	// Initialize Listeners
	const Listeners = fs.readdirSync(path.join(__dirname, 'listeners'));

	await forEachParallel(Listeners, async listenerFile => {
		logger.info(`Loading Listener ${listenerFile}`);
		await import(`./listeners/${listenerFile}`);
	});

	logger.info('Fully loaded listeners');

	client.login(DISCORD_TOKEN);
};

init();