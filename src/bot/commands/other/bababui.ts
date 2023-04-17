import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '../shared';

const bababuiCommand : Command = {
	name: 'bababui',
	aliases: ['stocazzo'],
	description: 'Invia un bababui',

	async run(message : Message) { fileCommand(message, 'resources/images/bababui.jpg'); },
};

module.exports = bababuiCommand;