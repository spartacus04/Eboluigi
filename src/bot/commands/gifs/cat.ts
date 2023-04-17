import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { gifCommand } from '../shared';

const catCommand : Command = {
	name: 'cat',
	description: 'Invia un immagine di un cane',

	async run(message : Message) { gifCommand(message, 'dog'); },
};

module.exports = catCommand;