import { Message } from 'discord.js';
import { logger } from '@logger';
import { Command, getMusicHandler } from '@commandHandler';

const skiptoCommand : Command = {
	name: 'skipto',
	description: 'Salta fino a una certa canzone nella queue',
	args: [
		{
			key: 'songNumber',
			label: 'numero della canzone',
			prompt: 'Inserisci il numero della canzone',
			type: 'integer',
		},
	],

	run(message : Message, { songNumber } : { songNumber : number }) {
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

		logger.info(`New queue starts at songNumber ${songNumber}`);
		getMusicHandler(message.guild.id).queue.splice(0, songNumber - 1);
		logger.info('Stopped current playback');
		getMusicHandler(message.guild.id).songDispatcher.player.stop();
	},
};

module.exports = skiptoCommand;