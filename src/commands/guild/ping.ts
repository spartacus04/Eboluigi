import { client, Command } from '../../config';
import { Message } from 'discord.js';

const pingCommand : Command = {
	name: 'ping',
	description: 'Invia il ping del bot',

	run(message : Message) {
		return message.channel.send(`La mia latenza è ${Date.now() - message.createdTimestamp}ms.\nLa latenza dell'api è ${Math.round(client.ws.ping)}ms.`);
	},
};

module.exports = pingCommand;