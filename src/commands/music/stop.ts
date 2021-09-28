import { Command, eMessage } from '../../config';
import { logger } from '../../logger';

const stopCommand : Command = {
	name: 'stop',
	aliases: ['end', 'leave', 'zittatroiaccia', 'zitta-troiaccia'],
	description: 'Lascia un canale e cancella la queue',

	run(message : eMessage) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			logger.warn('User isn\'t in a voice channel');
			return message.reply('Devi essere in un canale plebeo');
		}

		if(!message.getMusicHandler()) {
			logger.warn('Guild music handler isn\'t playing anything');
			return message.reply('Bruh non sto riproducendo niente');
		}

		if(voiceChannel.id != message.guild.me.voice.channel.id) {
			logger.warn('User isn\'t in current voice channel');
			return message.reply('Devi essere nel mio stesso canale plebeo');
		}

		logger.info('Emptying queue');
		message.getMusicHandler().queue = [];
		logger.info('Stopped current playback');
		message.getMusicHandler().songDispatcher.player.stop();
	},
};

module.exports = stopCommand;