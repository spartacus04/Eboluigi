import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { gifCommand } from '../shared';

const animeGifCommand : Command = {
	name: 'animegif',
	aliases: ['anime-gif', 'anime-gifs'],
	description: 'Invia una gif di saitama',

	async run(message : Message) { gifCommand(message, 'saitama'); },
};

module.exports = animeGifCommand;