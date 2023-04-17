import { Message } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { logger } from '@logger';
import { Command, getMusicHandler } from '@commandHandler';

const pauseCommand : Command = {
	name: 'pause',
	aliases: ['resume', 'toggle-pause'],
	description: 'Mette la riproduzione in pausa o la riprende',

	async run(message : Message) {
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

		if(getMusicHandler(message.guild.id).songDispatcher.player.state.status == AudioPlayerStatus.Paused) {
			logger.info('Resumed music playback');
			return getMusicHandler(message.guild.id).songDispatcher.player.unpause();
		}
		logger.info('Paused music playback');
		getMusicHandler(message.guild.id).songDispatcher.player.pause();
	},
};

module.exports = pauseCommand;