import { Message } from 'discord.js';
import { Command, getMusicHandler } from '../../config';
import { logger } from '../../logger';

const loopCommand : Command = {
	name: 'loop',
	description: 'Ripete una canzone',
	args: [
		{
			key: 'numOfTimesToLoop',
			label: 'numero di volte',
			prompt: 'Per quante volte deve essere ripetuta?',
			type: 'integer',
		},
	],

	run(message : Message, { numOfTimesToLoop } : { numOfTimesToLoop : number}) {
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

		if(numOfTimesToLoop < 1) {
			logger.warn(`Argument numOfTimesToLoop isn't valid: ${numOfTimesToLoop}`);
			return message.reply('Inserisci un numero valido');
		}

		logger.info(`Adding current playing song to the beginning of the queue ${numOfTimesToLoop} times`);
		for(let i = 0; i < numOfTimesToLoop; i++) {
			getMusicHandler(message.guild.id).queue.unshift(getMusicHandler(message.guild.id).nowPlaying);
		}

		logger.verbose(getMusicHandler(message.guild.id).queue);

		return message.channel.send(
			`${getMusicHandler(message.guild.id).nowPlaying.title} verrà loopato per ${numOfTimesToLoop} ${
				(numOfTimesToLoop == 1) ? 'volta' : 'volte'
			}`
		);
	},
};

module.exports = loopCommand;