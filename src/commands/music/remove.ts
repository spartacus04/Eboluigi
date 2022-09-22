import { Message } from 'discord.js';
import { Command, getMusicHandler } from '../../config';
import { logger } from '../../logger';

const removeSongCommand : Command = {
	name: 'remove',
	description: 'Rimuove una canzone dalla queue',
	args: [
		{
			key: 'songNumber',
			label: 'numero della canzone',
			prompt: 'Inserisci il numero della canzone',
			type: 'integer',
		},
	],

	run(message : Message, { songNumber } : { songNumber : number}) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			logger.warn('User isn\'t in a voice channel');
			return message.reply('Devi essere in un canale plebeo');
		}

		if(!getMusicHandler(message.guild.id)) {
			logger.warn('Guild music handler isn\'t playing anything');
			return message.reply('Bruh non sto riproducendo niente');
		}

		if(voiceChannel.id != message.member.voice.channel.id) {
			logger.warn('User isn\'t in current voice channel');
			return message.reply('Devi essere nel mio stesso canale plebeo');
		}

		if(songNumber < 1 || songNumber >= getMusicHandler(message.guild.id).queue.length) {
			logger.warn(`Argument songNumber isn't valid: ${songNumber}`);
			return message.reply('Inserisci un numero valido');
		}

		logger.info(`Removing song ${songNumber} from queue`);
		const removedSong = getMusicHandler(message.guild.id).queue.splice(songNumber - 1, 1);

		return message.channel.send(`Ho rimosso la canzone ${removedSong[0].title} dalla queue`);
	},
};

module.exports = removeSongCommand;