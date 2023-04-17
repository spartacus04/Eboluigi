import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '../shared';

const bababuiCommand : Command = {
	name: 'ynet',
	description: 'Invia una notizia israeliana recente',

	async run(message : Message) { fileCommand(message, 'resources/images/ynet.jpg'); },
};

module.exports = bababuiCommand;