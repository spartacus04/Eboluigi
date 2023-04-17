import { Message } from 'discord.js';
import { Command } from '@commandHandler';

const niggaCommand : Command = {
	name: 'nigga',
	description: 'Invia un N-Word pass',

	async run(message : Message) {
		await message.channel.sendTyping();
		return await message.channel.send('Eboluigi dice: il razzismo è più divertente quando non hai un n-word pass');
	},
};

module.exports = niggaCommand;