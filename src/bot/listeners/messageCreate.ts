import { Message } from 'discord.js';
import { PREFIX } from '@config';
import { handleCommand, client, Listener } from '@commandHandler';

const messageCreateHandler = (message : Message) => {
	if(message.content.toLowerCase().startsWith('eboluigi lesbico')) {
		return void message.channel.send('no tu');
	}

	if(message.content.toLowerCase().startsWith(PREFIX) && !message.author.bot) return handleCommand(message);
};

const messageCreateListener : Listener = {
	deferred: false,

	register: () => {
		client.on('messageCreate', messageCreateHandler);
	},

	unregister: () => {
		client.off('messageCreate', messageCreateHandler);
	},
};

module.exports = messageCreateListener;