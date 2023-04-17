import { Message, TextChannel } from 'discord.js';
import { logger } from '@logger';
import { Command } from '@commandHandler';

const pruneCommand: Command = {
	name: 'prune',
	aliases: ['delete-messages', 'bulk-delete'],
	description: 'Elimina molteplici messaggi in seguenza',
	adminOnly: true,
	args: [
		{
			key: 'deleteCount',
			label: 'numero di messaggi',
			prompt: 'Quanti messaggi vuoi eliminare?',
			type: 'integer',
		},
	],

	async run(message: Message, { deleteCount }: { deleteCount: number }) {
		logger.info(`Deleting ${deleteCount} previous messages`);

		await ((<TextChannel>message.channel) as TextChannel).bulkDelete(deleteCount + 1).catch(err => {
			logger.error(err);
			throw new Error('Impossibile cancellare i messaggi');
		});

		const delConfirmation = await (<TextChannel>message.channel).send(`Cancellati ${deleteCount} messaggi`);
		setTimeout(() => delConfirmation.delete(), 1000);
	},
};

module.exports = pruneCommand;
