import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'discord.js';
import { logger } from '@logger';
import { isDevelopment } from '@config';
import { forEachParallel } from '../util';
import { Command, Listener } from './interfaces';
import { music, musicGuild } from './musicHandler';

export class eClient extends Client {
	commands: Command[];
	groups: string[];
	botListeners: Listener[];
	deferredListeners: Listener[] = [];

	fetchGroups = (): string[] => {
		const commandPath = path.join(__dirname, '../commands');
		this.groups = fs.readdirSync(commandPath).filter(group => group != 'shared');

		return this.groups;
	};

	public rewriteReadme = async (): Promise<void> => {
		const readmePath = path.join(process.cwd(), 'README.md');

		if(fs.existsSync(readmePath)) fs.rmSync(readmePath);

		fs.writeFileSync(readmePath, fs.readFileSync(path.join(process.cwd(), 'resources/scripts/README-template.md'), 'utf-8'));

		for(let i = 0; i < this.groups.length; i++) {
			const group = this.groups[i];

			fs.appendFileSync(readmePath, `\n### ${group}\n`);
			const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${group}/`));

			await commandFiles.forEach(async cmd => {
				const command : Command = await import(`../commands/${group}/${cmd}`);

				let commandLine = `  - m.${command.name}`;

				if(command.aliases) {
					command.aliases.forEach(alias => {
						commandLine += `/${alias}`;
					});
				}

				if(command.args) {
					command.args.forEach(arg => {
						commandLine += ` <${arg.label}>`;
					});
				}

				commandLine += ` : ${command.description}\n`;
				fs.appendFileSync(readmePath, commandLine);
			});

			await new Promise(res => setTimeout(res, 1000));
		}
	};

	loadGroup = async (name: string): Promise<string[]> => {
		logger.info(`Loading Group ${name}`);
		const loaded: string[] = [];
		const groupPath = path.join(__dirname, '../commands', name);
		const groups = fs.readdirSync(groupPath);

		await forEachParallel(groups, async commandName => {
			const success = await this.loadCommand(name, commandName);
			if (success) loaded.push(commandName);
		});

		return loaded;
	};

	loadCommand = async (groupPath: string, name: string): Promise<boolean> => {
		logger.info(`Loading Command ${name}`);
		const commandPath = path.join(__dirname, '../commands', groupPath, name);

		const command: Command = await import(commandPath);

		if (this.commands.includes(command)) {
			logger.warn(`Command ${name} is already loaded`);
			return false;
		}

		if (
			this.commands.find(cmd => {
				if (cmd.name == command.name) return true;
				if (cmd.aliases && cmd.aliases.includes(cmd.name)) return true;
				if (command.aliases) {
					command.aliases.forEach(alias => {
						if (cmd.name == alias) return true;
						if (cmd.aliases && cmd.aliases.includes(alias)) return true;
					});
				}
			})
		) {
			logger.warn(`Command ${name} has the name or alias already registered`);
			return false;
		}

		this.commands.push(command);
		return true;
	};

	fetchListeners = (): string[] => {
		return fs.readdirSync(path.join(__dirname, '../listeners'));
	};

	loadListener = async (name: string) => {
		logger.info(`Loading listener ${name}`);
		const listener: Listener = await import(`../listeners/${name}`);

		if (listener.deferred) {
			this.once('ready', () => {
				logger.info(`Loading deferred listener ${name}`);
				listener.register();
			});
		}
		else {
			listener.register();
		}
	};

	getMusicHandler = (id: string): musicGuild => {
		return music.get(id);
	};

	getCommand = (name: string): Command => {
		const validCommands = this.commands.filter(
			command => command.name == name || (command.aliases && command.aliases.includes(name)),
		);
		if (validCommands.length > 0) return validCommands[0];
		return null;
	};
}
