import { Command } from '../../config';
import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const whoMadeMeCommand : Command = {
	name: 'whomademe',
	description: 'Invia info riguardo al creatore',

	async run(message : Message) {
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder().setLabel('Altre info').setStyle(ButtonStyle.Link).setURL('https://github.com/spartacus04/Eboluigi'),
			);
		return await message.channel.send({ content: 'Mio padre @spartacus04#9422 mi ha creato con :heart:', components: [ row ] });
	},
};

module.exports = whoMadeMeCommand;