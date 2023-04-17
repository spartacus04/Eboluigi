import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '../shared';

const diegoCommand : Command = {
	name: 'diego',
	description: 'Invia un Diego',

	async run(message : Message) { fileCommand(message, 'resources/images/diego.jpg'); },
};

module.exports = diegoCommand;