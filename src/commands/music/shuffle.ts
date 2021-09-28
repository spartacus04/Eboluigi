import { MessageEmbed } from 'discord.js';
import { Command, eMessage } from '../../config';
import { logger } from '../../logger';
import { videoObj } from '../../musicHandler';

const shuffleCommand : Command = {
	name: 'shuffle',
	description: 'Riproduce la queue in modo casuale',

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

		if(message.getMusicHandler().queue.length < 1) {
			logger.warn('Cannot shuffle queue if there\'s 0 elements');
			return message.channel.send('Bruh non sto riproducendo niente');
		}

		logger.info('Shuffling queue');
		shuffleQueue(message);

		const titleArray : string[] = [];

		logger.info('Showcasing new queue to user');
		message.getMusicHandler().queue.slice(0, 10).forEach((element : videoObj) => {
			titleArray.push(element.title);
		});

		const queueEmbed = new MessageEmbed()
			.setColor('#ff7373')
			.setTitle('Nuova Queue');
		for(let i = 0; i < 10; i++) {
			queueEmbed.addField(`${i + 1}`, titleArray[i]);
		}

		return message.channel.send({ embeds: [queueEmbed] });
	},
};

const shuffleQueue = (message : eMessage) : void => {
	const queue = message.getMusicHandler().queue;
	for (let i = queue.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[queue[i], queue[j]] = [queue[j], queue[i]];
	}
	message.getMusicHandler().queue = queue;
};

module.exports = shuffleCommand;