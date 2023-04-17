import { Message } from 'discord.js';
import { Command } from '@commandHandler';

const randomCommand : Command = {
	name: 'random',
	aliases: ['random-number', 'number-between'],
	description: 'Invia un numero a caso tra quelli specificati',
	args: [
		{
			key: 'min',
			label: 'numero minimo',
			prompt: 'Inserisci il numero minimo',
			type: 'integer',
		},
		{
			key: 'max',
			label: 'numero massimo',
			prompt: 'Inserisci il numero massimo',
			type: 'integer',
		},
	],

	run(message : Message, { min, max } : { min : number, max : number }) {
		void min, max;
		return message.channel.send('69420 lmao');
	},
};

module.exports = randomCommand;