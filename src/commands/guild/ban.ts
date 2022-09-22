import { Command } from '../../config';
import { Message, EmbedBuilder, Colors } from 'discord.js';
import { logger } from '../../logger';

const banCommand : Command = {
	name: 'ban',
	aliases: ['ban-member', 'ban-hammer'],
	description: 'Bandisce un membro del server',
	adminOnly: true,
	args: [
		{
			key: 'userToBan',
			label: 'utente da bannare',
			prompt: 'Menziona l\'utente oppure scrivi l\'ID',
			type: 'string',
		},
		{
			key: 'reason',
			label: 'motivo del ban',
			prompt: 'Scrivi il motivo',
			type: 'string',
		},
	],

	async run(message : Message, { userToBan, reason } : { userToBan : string, reason : string }) {
		const user = message.mentions.members.first() || await message.guild.members.fetch(userToBan);
		logger.verbose(user);
		if(!user) {
			logger.warn('Specified user does not exist');
			return await message.reply('L\'utente dato non esiste');
		}
		if(!user.bannable) {
			logger.warn('User cannot be banned from guild');
			return await message.reply('L\'utente dato non può essere bandito');
		}

		await user.ban({ reason });
		logger.info(`Banned user ${user.displayName}`);

		const banEmbed = new EmbedBuilder()
			.addFields(
				{ name: 'Bannato', value: user.user.username },
				{ name: 'Motivo', value: reason },
			)
			.setColor(Colors.Red);

		await message.channel.send({ embeds: [banEmbed] });
	},
};

module.exports = banCommand;