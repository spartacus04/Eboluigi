import { Message } from 'discord.js';
import { Command, getMusicHandler } from '../../config';
import { logger } from '../../logger';

const skipCommand : Command = {
	name: 'skip',
	aliases: ['skip-song', 'advance-song'],
	description: 'Salta la canzone',

	run(message : Message) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			logger.warn('User isn\'t in a voice channel');
			return message.reply('Devi essere in un canale plebeo');
		}

		if(!getMusicHandler(message.guild.id)) {
			logger.warn('Guild music handler isn\'t playing anything');
			return message.reply('Bruh non sto riproducendo niente');
		}

		if(voiceChannel.id != message.guild.me.voice.channel.id) {
			logger.warn('User isn\'t in current voice channel');
			return message.reply('Devi essere nel mio stesso canale plebeo');
		}

		logger.info('Stopped current playback');
		getMusicHandler(message.guild.id).songDispatcher.player.stop();
	},
};

module.exports = skipCommand;