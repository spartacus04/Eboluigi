import { Command } from '../../config';
import { Message } from 'discord.js';

const fortuneCommand : Command = {
	name: 'fortune',
	description: 'Invia una frase da biscotto della fortuna',

	async run(message : Message) {
		return message.channel.send('Il biscotto della fortuna dice che sei gay');
	},
};

module.exports = fortuneCommand;