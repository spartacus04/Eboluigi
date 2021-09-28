import { Command } from '../../config';
import { Message } from 'discord.js';

const killCommand : Command = {
	name: 'killmepls',
	aliases: ['kill-me-pls'],
	description: 'Invia un meme Wholesome',

	async run(message : Message) {
		return message.channel.send('Ora conosco la tua posizione');
	},
};

module.exports = killCommand;