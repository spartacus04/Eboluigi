import { Message, TextChannel } from 'discord.js';
import { logger } from '@logger';
import { Command } from '@commandHandler';

const carcereCommand: Command = {
	name: 'carcere',
	aliases: ['jail', 'gulag'],
	description: 'Incarcera o scarcera un membro del server',
	adminOnly: true,
	args: [
		{
			key: 'userToJail',
			label: 'utente da carcerare',
			prompt: 'Menziona l\'utente oppure scrivi l\'ID',
			type: 'string',
		},
	],

	async run(message: Message, { userToJail }: { userToJail: string }) {
		const user = message.mentions.members.first() || (await message.guild.members.fetch(userToJail));
		logger.verbose(user);

		if (!user) {
			logger.warn('Specified user does not exist');
			return await message.reply('L\'utente dato non esiste');
		}

		const jailRole = message.guild.roles.cache.find(role => role.id == '849303916655280130');

		if (!user.roles.cache.find(role => role.id == jailRole.id)) {
			logger.info(`Jailing user ${user.displayName}`);
			await user.roles.add(jailRole);
			return await (<TextChannel>message.channel).send(`${user.displayName} è stato carcerato`);
		}
		else {
			logger.info(`Unjailing user ${user.displayName}`);
			await user.roles.remove(jailRole);
			return await (<TextChannel>message.channel).send(`${user.displayName} è stato scarcerato`);
		}
	},
};

module.exports = carcereCommand;
