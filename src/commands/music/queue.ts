import { Command, getMusicHandler } from '../../config';
import { Message, MessageEmbed } from 'discord.js';
import { logger } from '../../logger';
import { videoObj } from '../../musicHandler';

const queueCommand : Command = {
	name: 'queue',
	aliases: ['song-list', 'next-songs'],
	description: 'Mostra le canzoni in coda',

	async run(message : Message) {
		await message.channel.sendTyping();
		const titleArray : string[] = [];

		if(!getMusicHandler(message.guild.id)) {
			logger.warn('Guild music handler isn\'t playing anything');
			return message.reply('Bruh non sto riproducendo niente');
		}

		logger.info('Showing only first 10 elements of queue');
		getMusicHandler(message.guild.id).queue.slice(0, 10).forEach((obj : videoObj) => {
			titleArray.push(obj.title);
		});

		const queueEmbed = new MessageEmbed()
			.setColor('#ff7373')
			.setTitle(`Queue - ${getMusicHandler(message.guild.id).queue.length} oggetti`);
		for (let i = 0; i < titleArray.length; i++) {
			queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
		}
		await message.channel.send({ embeds: [queueEmbed] });
	},
};

module.exports = queueCommand;