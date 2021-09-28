import { logger } from '../logger';
import fs from 'fs';
import path from 'path';
import { client, Command } from '../config';
import { forEachParallel } from '.';

export const getGroups = () : string[] => {
	const commandPath = path.join(__dirname, '../commands');
	return fs.readdirSync(commandPath);
};

export const loadCommand = async (groupPath : string, name : string) : Promise<boolean> => {
	logger.info(`Loading Command ${name}`);
	const commandPath = path.join(groupPath, name);

	const command : Command = await import(commandPath);

	if(client.commands.includes(command)) {
		logger.warn(`Command ${name} is already loaded`);
		return false;
	}

	if(client.commands.find(cmd => {
		if(cmd.name == command.name) return true;
		if(cmd.aliases && cmd.aliases.includes(cmd.name)) return true;
		if(command.aliases) {
			command.aliases.forEach(alias => {
				if(cmd.name == alias) return true;
				if(cmd.aliases && cmd.aliases.includes(alias)) return true;
			});
		}
	})) {
		logger.warn(`Command ${name} has the name or alias already registered`);
		return false;
	}

	client.commands.push(command);
	return true;
};

export const loadGroup = async (name : string) : Promise<string[]> => {
	logger.info(`Loading Group ${name}`);
	const loaded : string[] = [];
	const groupPath = path.join(__dirname, '../commands', name);
	const groups = fs.readdirSync(groupPath);

	await forEachParallel(groups, (async commandName => {
		const success = await loadCommand(groupPath, commandName);
		if(success) loaded.push(commandName);
	}));

	return loaded;
};

// export const unloadCommand = (name : string) => {

// };

// export const unloadGroup = (name : string) => {

// };

