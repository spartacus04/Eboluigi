import { Command } from '../../config';
import { Message, TextChannel } from 'discord.js';
import { logger } from '../../logger';

const pruneCommand : Command = {
	name: 'prune',
	aliases: ['delete-messages', 'bulk-delete'],
	description: 'Bandisce un membro del server',
	adminOnly: true,
	args: [
		{
			key: 'deleteCount',
			label: 'numero di messaggi',
			prompt: 'Quanti messaggi vuoi eliminare?',
			type: 'integer',
		},
	],

	async run(message : Message, { deleteCount } : { deleteCount : number}) {
		logger.info(`Deleting ${deleteCount} previous messages`);
		await (message.channel as TextChannel).bulkDelete(deleteCount + 1).catch(err => {
			logger.error(err);
			throw new Error('Impossibile cancellare i messaggi');
		});
		const delConfirmation = await message.channel.send(`Cancellati ${deleteCount} messaggi`);
		setTimeout(() => delConfirmation.delete(), 1000);
	},
};

module.exports = pruneCommand;