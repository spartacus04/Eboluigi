import { Command } from '../../config';
import { Message } from 'discord.js';
import zalgo from 'to-zalgo';

const sayCommand : Command = {
	name: 'say',
	description: 'Ripeto cio che scrivi in zalgo',
	args: [
		{
			key: 'text',
			label: 'testo da ripetere',
			prompt: 'Cosa vuoi farmi ripetere?',
			type: 'string',
		},
	],

	run(message : Message, { text } : { text : string }) {
		if(text.toLowerCase() == 'eboluigi lesbico') {
			return message.channel.send('i tuoi insulti da comune mortale sono patetici');
		}
		return message.channel.send(zalgo(text, { up: true, middle: true, down: true, size: 'maxi' }));
	},
};

module.exports = sayCommand;