import { Command, eMessage } from '../../config';
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

	run(message : eMessage, { numOfTimesToLoop } : { numOfTimesToLoop : number}) {
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

		if(numOfTimesToLoop < 1) {
			logger.warn(`Argument numOfTimesToLoop isn't valid: ${numOfTimesToLoop}`);
			return message.reply('Inserisci un numero valido');
		}

		logger.info(`Adding current playing song to the beginning of the queue ${numOfTimesToLoop} times`);
		for(let i = 0; i < numOfTimesToLoop; i++) {
			message.getMusicHandler().queue.unshift(message.getMusicHandler().nowPlaying);
		}

		logger.verbose(message.getMusicHandler().queue);

		return message.channel.send(
			`${message.getMusicHandler().nowPlaying.title} verrà loopato per ${numOfTimesToLoop} ${
				(numOfTimesToLoop == 1) ? 'volta' : 'volte'
			}`
		);
	},
};

module.exports = loopCommand;