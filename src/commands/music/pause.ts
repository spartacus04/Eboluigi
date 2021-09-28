import { Command, eMessage } from '../../config';
import { AudioPlayerStatus } from '@discordjs/voice';
import { logger } from '../../logger';

const pauseCommand : Command = {
	name: 'pause',
	aliases: ['resume', 'toggle-pause'],
	description: 'Mette la riproduzione in pausa o la riprende',

	async run(message : eMessage) {
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

		if(message.getMusicHandler().songDispatcher.player.state.status == AudioPlayerStatus.Paused) {
			logger.info('Resumed music playback');
			return message.getMusicHandler().songDispatcher.player.unpause();
		}
		logger.info('Paused music playback');
		message.getMusicHandler().songDispatcher.player.pause();
	},
};

module.exports = pauseCommand;