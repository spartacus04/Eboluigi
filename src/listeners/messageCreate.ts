import { Message } from 'discord.js';
import { handleCommand } from '../commandHandler';
import { client, eMessage, PREFIX } from '../config';
import { music } from '../musicHandler';

client.on('messageCreate', (message : Message) => {
	if(!(message as eMessage).getMusicHandler) {
		(message as eMessage).getMusicHandler = () => {
			return music.get(message.guildId);
		};
	}

	if(message.content.toLowerCase().startsWith('eboluigi lesbico')) {
		return void message.channel.send('no tu');
	}

	if(message.content.toLowerCase().startsWith(PREFIX) && !message.author.bot) return handleCommand(message as eMessage);
});
