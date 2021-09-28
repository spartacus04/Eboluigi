import { Command } from '../../config';
import { Message } from 'discord.js';

const diegoCommand : Command = {
	name: 'diego',
	description: 'Invia un Diego',

	async run(message : Message) {
		await message.channel.sendTyping();
		await message.channel.send({ files: ['resources/images/diego.jpg'] });
	},
};

module.exports = diegoCommand;