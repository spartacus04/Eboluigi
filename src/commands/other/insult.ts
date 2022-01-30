import { Command } from '../../config';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { logger } from '../../logger';

const insultCommand : Command = {
	name: 'insult',
	description: 'Invia un insulto in italiano',

	async run(message : Message) {
		try {
			const res = await fetch('https://evilinsult.com/generate_insult.php?lang=it&type=json');
			const data = await res.json() as any;
			logger.verbose(data);

			const embed = new MessageEmbed()
				.setColor('#E41032')
				.setTitle('Insulto')
				.setDescription(data.insult)
				.setURL('https://evilinsult.com');

			return message.channel.send({ embeds : [ embed ] });
		}
		catch (err) {
			logger.error(err);
			message.channel.send('Bruh non va : sob:');
		}
	},
};

module.exports = insultCommand;