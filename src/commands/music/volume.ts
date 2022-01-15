import { Command, getMusicHandler } from '../../config';
import { AudioResource } from '@discordjs/voice';
import { logger } from '../../logger';
import { Message } from 'discord.js';

const volumeCommand : Command = {
	name: 'volume',
	aliases: ['change-volume'],
	description: 'Cambia o mostra il volume',
	args: [
		{
			key: 'wantedVolume',
			label: 'volume',
			prompt: 'Inserisci il nuovo volume',
			type: 'float',
		},
	],

	async run(message : Message, { wantedVolume } : { wantedVolume : string }) {
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

		logger.info(`Setting volume to ${wantedVolume}`);
		getMusicHandler(message.guild.id).volume = +wantedVolume;
		((getMusicHandler(message.guild.id).songDispatcher.player.state as any).resource as AudioResource).volume.setVolume(+wantedVolume);

		await message.channel.send(`Ho messo il volume a: ${wantedVolume}`);
	},
};

module.exports = volumeCommand;