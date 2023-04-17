import { Message } from 'discord.js';
import { logger } from '@logger';

export class pError extends Error {
	prettyPrint: boolean;

	constructor(message: string) {
		super(message);
		this.prettyPrint = true;
	}
}

export const handleError = async (error: Error, message: Message): Promise<unknown> => {
	if (error instanceof pError) {
		return await message.reply(error.message);
	}

	logger.error(`${error}`);

	await message.reply(`c'è stato un problema durante l'esecuzione del comando\n\`\`\`${error.message}\`\`\``);
};
