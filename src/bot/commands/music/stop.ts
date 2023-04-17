import { Message } from 'discord.js';
import { logger } from '@logger';
import { Command, getMusicHandler } from '@commandHandler';

const stopCommand : Command = {
	name: 'stop',
	aliases: ['end', 'leave', 'zittatroiaccia', 'zitta-troiaccia'],
	description: 'Lascia un canale e cancella la queue',

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

		if(voiceChannel.id != message.member.voice.channel.id) {
			logger.warn('User isn\'t in current voice channel');
			return message.reply('Devi essere nel mio stesso canale plebeo');
		}

		logger.info('Emptying queue');
		getMusicHandler(message.guild.id).queue = [];
		logger.info('Stopped current playback');
		getMusicHandler(message.guild.id).songDispatcher.player.stop();
	},
};

module.exports = stopCommand;