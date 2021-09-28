import { Command, eMessage } from '../../config';
import { AudioResource } from '@discordjs/voice';
import { logger } from '../../logger';

const earrapeCommand : Command = {
	name: 'earrape',
	description: 'Alza il volume di tantissimo per un secondo',

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

		const previousVolume = message.getMusicHandler().volume;
		((message.getMusicHandler().songDispatcher.player.state as any).resource as AudioResource).volume.setVolume(69420);
		logger.info('Set the volume at 69420');

		setTimeout(() => {
			((message.getMusicHandler().songDispatcher.player.state as any).resource as AudioResource).volume.setVolume(previousVolume);
			logger.info(`Set the volume at ${previousVolume}`);
		}, 1000);
	},
};

module.exports = earrapeCommand;