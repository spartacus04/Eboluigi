import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { Command } from '@commandHandler';

const whoMadeMeCommand: Command = {
	name: 'whomademe',
	description: 'Invia info riguardo al creatore',

	async run(message: Message) {
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('Altre info')
				.setStyle(ButtonStyle.Link)
				.setURL('https://github.com/spartacus04/Eboluigi'),
		);

		return await (<TextChannel>message.channel).send({
			content: 'Mio padre @spartacus04#9422 mi ha creato con :heart:',
			components: [row],
		});
	},
};

module.exports = whoMadeMeCommand;
