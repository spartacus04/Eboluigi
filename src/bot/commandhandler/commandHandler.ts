import { GuildMember, Message, TextChannel } from 'discord.js';
import { PREFIX, ADMIN_ROLE_ID } from '@config';
import { logger } from '@logger';
import { parseArgument } from './args';
import { pError, handleError } from './errors';
import { argument, client, Command } from './interfaces';

export const handleCommand = async (message: Message): Promise<void> => {
	logger.info(`${message.author.username} issued command: ${message.content}`);

	const parsedCommand = await parseCommand(message.content.trim(), message);

	if (!parsedCommand) return void message.reply('Il comando non esiste');

	const { command, args: rawArgs } = parsedCommand;

	if (command.adminOnly) {
		if (!isAdmin(message.guild.members.cache.find(member => member.id == message.author.id))) {
			logger.warn('User issued an admin only command');
			return void (<TextChannel>message.channel).send('Non puoi eseguire questo comando');
		}
	}

	let args: { [id: string]: unknown };

	if (rawArgs) {
		logger.info('Validating args');
		try {
			args = argumentValidator(rawArgs, command.args);
		}
		catch (err) {
			return void message.reply((err as Error).message);
		}
	}

	if (command.run.constructor.name == 'AsyncFunction') {
		logger.info('Exexcuting command asynchronously');
		return new Promise<void>((resolve, reject) => {
			command
				.run(message, args || null)
				.then(() => {
					resolve();
				})
				.catch(err => {
					handleError(err, message);
					reject();
				});
		});
	}

	return new Promise<void>(() => {
		try {
			command.run(message, args || null);
		}
		catch (err: unknown) {
			if (err instanceof Error || err instanceof pError) {
				handleError(err, message);
			}
			else {
				handleError(new Error(`${err}`), message);
			}
		}
	});
};

const parseCommand = async (rawCommand: string, message: Message): Promise<{ command: Command; args?: string[] }> => {
	const [commandName, ...rawArgs] = rawCommand.substring(PREFIX.length).split(' ');
	const command = client.getCommand(commandName);

	if (!command) return void logger.warn(`Command ${commandName} does not exist`);

	if (!command.args) {
		logger.info(`Executing Command ${command.name}`);
		logger.verbose(command);
		return { command };
	}

	const args: string[] = [];

	await command.args.forEach(async (commandArg, i) => {
		if (rawArgs.length == 0) {
			logger.info(`Argument ${commandArg.key} wasn't specified`);
			rawArgs.push(await requireArgument(commandArg.prompt, message));

			if (rawArgs[0] == '') {
				return void logger.warn('User didn\'t provide an argument');
			}

			logger.info(`User provided argument ${rawArgs[0]}`);
		}

		args.push(i == command.args.length - 1 ? rawArgs.join(' ') : rawArgs.shift());
	});

	logger.info(`Executing Command ${command.name} with arguments: ${args}`);

	return { command, args };
};

const argumentValidator = (args: string[], cmdArgs: argument[]): { [id: string]: unknown } => {
	const argObj: { [id: string]: unknown } = {};

	for (let i = 0; i < args.length; i++) {
		const arg = parseArgument(args[i], cmdArgs[i].type);

		if (!arg) {
			logger.warn(`Argument ${args[i]} isn't of type ${cmdArgs[i].type}`);
			throw new Error(`L'argomento ${cmdArgs[i].key} deve essere di tipo ${cmdArgs[i].type}`);
		}

		argObj[cmdArgs[i].key] = arg;
	}

	return argObj;
};

const requireArgument = async (prompt: string, message: Message): Promise<string> => {
	const promptMessage = await message.reply(prompt);

	const filter = (m: Message) => m.author.id == message.author.id && !m.content.startsWith(PREFIX);

	try {
		const collected = await (<TextChannel>promptMessage.channel).awaitMessages({ filter, time: 15000, max: 1 });

		const rMessage = collected.first();

		const response = rMessage.content;

		promptMessage.delete();
		rMessage.delete();

		return response;
	}
	catch (error) {
		return '';
	}
};

const isAdmin = (user: GuildMember): boolean => !!user.roles.cache.find(role => role.id == ADMIN_ROLE_ID);
