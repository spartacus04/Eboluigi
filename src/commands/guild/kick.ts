import { Command } from '../../config';
import { Message, EmbedBuilder, Colors } from 'discord.js';
import { logger } from '../../logger';

const kickCommand : Command = {
	name: 'kick',
	aliases: ['kick-member', 'throw'],
	description: 'Espelle un membro del server',
	adminOnly: true,
	args: [
		{
			key: 'userToKick',
			label: 'utente da espellere',
			prompt: 'Menziona l\'utente oppure scrivi l\'ID',
			type: 'string',
		},
		{
			key: 'reason',
			label: 'motivo dell\'espulsione',
			prompt: 'Scrivi il motivo',
			type: 'string',
		},
	],

	async run(message : Message, { userToKick, reason } : { userToKick : string, reason : string}) {
		const user = message.mentions.members.first() || await message.guild.members.fetch(userToKick);
		logger.verbose(user);
		if(!user) {
			logger.warn('Specified user does not exist');
			return await message.reply('L\'utente dato non esiste');
		}
		if(!user.kickable) {
			logger.warn('User cannot be kicked from guild');
			return await message.reply('L\'utente dato non può essere espulso');
		}

		await user.kick(reason);
		logger.info(`Banned user ${user.displayName}`);

		const banEmbed = new EmbedBuilder()
			.addFields(
				{ name: 'Espulso', value: user.user.username },
				{ name: 'Motivo', value: reason }
			)
			.setColor(Colors.Red);

		await message.channel.send({ embeds: [banEmbed] });
	},
};

module.exports = kickCommand;