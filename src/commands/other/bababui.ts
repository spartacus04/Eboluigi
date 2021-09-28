import { Command } from '../../config';
import { Message } from 'discord.js';

const bababuiCommand : Command = {
	name: 'bababui',
	aliases: ['stocazzo'],
	description: 'Invia un bababui',

	async run(message : Message) {
		await message.channel.sendTyping();
		await message.channel.send({ files: ['resources/images/bababui.jpg'] });
	},
};

module.exports = bababuiCommand;