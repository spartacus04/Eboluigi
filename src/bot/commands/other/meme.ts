import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { redditCommand } from '../shared';

const memeCommand : Command = {
	name: 'meme',
	aliases: ['cursedimage'],
	description: 'Invia una cursed image',

	async run(message : Message) { redditCommand(message, ['hmmm']); },
};

module.exports = memeCommand;