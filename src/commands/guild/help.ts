import { Command } from '../../config';
import { Message, MessageActionRow, MessageButton } from 'discord.js';

const helpCommand : Command = {
	name: 'help',
	description: 'Invia dei comandi di aiuto',

	async run(message : Message) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton().setLabel('Comandi').setStyle('LINK').setURL('https://spartacus04.github.io/Eboluigi/'),
			);
		return await message.channel.send({ content: 'Puoi controllare i miei comandi a questo link', components: [ row ] });
	},
};

module.exports = helpCommand;