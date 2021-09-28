import { Command } from '../../config';
import { Message } from 'discord.js';

const bababuiCommand : Command = {
	name: 'ynet',
	description: 'Invia una notizia israeliana recente',

	async run(message : Message) {
		await message.channel.sendTyping();
		await message.channel.send({ files: ['resources/images/ynet.jpg'] });
	},
};

module.exports = bababuiCommand;