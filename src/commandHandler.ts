import { GuildMember, Message } from 'discord.js';
import { ADMIN_ROLE_ID, argument, client, Command, PREFIX } from './config';
import { pError } from './errors';
import { logger } from './logger';
import { parseArgument } from './util/args';


export const handleCommand = async (message: Message) : Promise<void> => {
	logger.info(`${message.author.username} issued command: ${message.content}`);

	const parsedCommand = await parseCommand(message.content.trim(), message);

	if(!parsedCommand) return void message.reply('Il comando non esiste');

	const { command, rargs } = parsedCommand;

	if(command.adminOnly) {
		if(!isAdmin(message.guild.members.cache.find(member => member.id == message.author.id))) {
			logger.warn('User issued an admin only command');
			return void message.channel.send('Non puoi eseguire questo comando');
		}
	}

	let args;

	if(rargs) {
		logger.info('Validating args');
		try{
			args = argumentValidator(rargs, command.args);
		}
		catch(err) {
			return void message.reply((err as Error).message);
		}
	}

	if(command.run.constructor.name == 'AsyncFunction') {
		logger.info('Exexcuting command asynchronously');
		return void command.run(message, args || null).catch(err => {
			handleError(err, message);
		});
	}
	try {
		return void command.run(message, args || null);
	}
	catch (err) {
		handleError(err as Error | pError, message);
	}
};

const parseCommand = async (baseCommandP : string, message : Message) : Promise<{ command: Command; rargs?: string[]; }>=> {
	const baseCommand = baseCommandP.substring(PREFIX.length);

	const commandName = baseCommand.split(' ')[0];

	const command = getCommand(commandName);

	if(!command) {
		logger.warn(`Command ${commandName} does not exist`);
		return null;
	}
	if(!command.args) {
		logger.info(`Executing Command ${command.name}`);
		logger.verbose(command);
		return { command };
	}

	let rawArgs = baseCommand.substring(commandName.length + 1);

	const args : string[] = [];

	for(let i = 0; i < command.args.length; i++) {
		let arg = rawArgs.split(' ')[0];
		if(arg == '') {
			logger.info(`Argument ${command.args[i].key} isn't specified`);
			arg = await requireArgument(command.args[i].prompt, message);
			if(arg == '') {
				logger.warn('User didn\'t provide an argument');
				return null;
			}
			logger.info(`User provided argument ${arg}`);
		}
		args.push(i == command.args.length - 1 ? rawArgs : arg);
		rawArgs = rawArgs.substring(args[i].length + 1);
	}

	logger.info(`Executing Command ${command.name} with arguments: ${args}`);

	return { command, rargs: args };
};

const getCommand = (name : string) : Command => {
	const validCommands = client.commands.filter(command => command.name == name || (command.aliases && command.aliases.includes(name)));
	if(validCommands.length > 0) return validCommands[0];
	return null;
};

const argumentValidator = (args : string[], cmdArgs: argument[]) : {[id: string] : unknown} => {
	const argObj: {[id: string] : unknown} = {};
	for (let i = 0; i < args.length; i++) {
		const arg = parseArgument(args[i], cmdArgs[i].type);
		if(!arg) {
			logger.warn(`Argument ${args[i]} isn't of type ${cmdArgs[i].type}`);
			throw new Error(`L'argomento ${cmdArgs[i].key} deve essere di tipo ${cmdArgs[i].type}`);
		}

		argObj[cmdArgs[i].key] = arg;
	}
	return argObj;
};

const handleError = async (error : Error, message : Message) : Promise<unknown> => {
	if(error instanceof pError) {
		return await message.reply(error.message);
	}
	logger.error(error);
	await message.reply(`c'è stato un problema durante l'esecuzione del comando\n\`\`\`${error.message}\`\`\``);
};

const requireArgument = async (prompt : string, message : Message) : Promise<string> => {
	const promptMessage = await message.reply(prompt);

	const filter = (m : Message) => m.author.id == message.author.id && !m.content.startsWith(PREFIX);

	try {
		const collected = await promptMessage.channel.awaitMessages({ filter, time: 15000, max : 1 });

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

const isAdmin = (user : GuildMember) : boolean => {
	return !!user.roles.cache.find(role => role.id == ADMIN_ROLE_ID);
};