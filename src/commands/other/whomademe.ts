import { Command } from '../../config';
import { Message, MessageActionRow, MessageButton } from 'discord.js';

const whoMadeMeCommand : Command = {
	name: 'whomademe',
	description: 'Invia info riguardo al creatore',

	async run(message : Message) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton().setLabel('Altre info').setStyle('LINK').setURL('https://github.com/spartacus04/Eboluigi'),
			);
		return await message.channel.send({ content: 'Mio padre @spartacus04#9422 mi ha creato con :heart:', components: [ row ] });
	},
};

module.exports = whoMadeMeCommand;