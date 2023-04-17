import { Message, TextChannel } from 'discord.js';
import { client, Command } from '@commandHandler';

const pingCommand: Command = {
	name: 'ping',
	description: 'Invia il ping del bot',

	run(message: Message) {
		return (<TextChannel>message.channel).send(
			`La mia latenza è ${Date.now() - message.createdTimestamp}ms.\nLa latenza dell'api è ${Math.round(
				client.ws.ping,
			)}ms.`,
		);
	},
};

module.exports = pingCommand;
