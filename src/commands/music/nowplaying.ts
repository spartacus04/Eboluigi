import { AudioResource } from '@discordjs/voice';
import { MessageEmbed } from 'discord.js';
import { Command, eMessage } from '../../config';
import { logger } from '../../logger';

const npCommand : Command = {
	name: 'nowplaying',
	aliases: ['np', 'currently-playing', 'now-playing'],
	description: 'Lascia un canale e cancella la queue',

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

		const video = message.getMusicHandler().nowPlaying;
		logger.verbose(video);

		const description = video.duration == 'Live Stream' ? 'Live Stream' : playbackBar(message, video);

		const videoEmbed = new MessageEmbed()
			.setThumbnail(video.thumbnail)
			.setColor('#e9f931')
			.setTitle(video.title)
			.setDescription(description);

		logger.info('Sending info to user');
		await message.channel.send({ embeds: [videoEmbed] });
	},
};


const playbackBar = (message : eMessage, video : any) : string => {
	const passedTimeInMS = ((message.getMusicHandler().songDispatcher.player.state as any).resource as AudioResource).playbackDuration;
	const passedTimeFormatted = formatDuration(passedTimeInMS / 1000);

	const totalDurationObj = video.rawDuration;
	const totalDurationFormatted = formatDuration(
		totalDurationObj
	);

	let totalDurationInMS = 0;
	Object.keys(totalDurationObj).forEach(function(key) {
		if (key == 'hours') {
			totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 3600000;
		}
		else if (key == 'minutes') {
			totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 60000;
		}
		else if (key == 'seconds') {
			totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 100;
		}
	});
	const playBackBarLocation = Math.round(
		(passedTimeInMS / totalDurationInMS) * 10
	);
	let playBack = '';
	for (let i = 1; i < 21; i++) {
		if (playBackBarLocation == 0) {
			playBack = ':musical_note:▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
			break;
		}
		else if (playBackBarLocation == 10) {
			playBack = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬:musical_note:';
			break;
		}
		else if (i == playBackBarLocation * 2) {
			playBack = playBack + ':musical_note:';
		}
		else {
			playBack = playBack + '▬';
		}
	}
	playBack = `${passedTimeFormatted}  ${playBack}  ${totalDurationFormatted}`;
	return playBack;
};

const formatDuration = (duration : number) : string => {
	let formattedDate = new Date(duration).toISOString().substring(11, 8);
	while(formattedDate.startsWith('00:')) {
		formattedDate = formattedDate.substring(3);
	}
	return formattedDate;
};

module.exports = npCommand;