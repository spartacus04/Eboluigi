import { Command, getMusicHandler } from '../../config';
import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, User, VoiceChannel } from 'discord.js';
import scdl from 'soundcloud-downloader/dist';
import { TrackInfo } from 'soundcloud-downloader/dist/info';
import { music, pushToQueue, videoObj } from '../../musicHandler';
import { AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, StreamType } from '@discordjs/voice';
import { pError } from '../../errors';
import { logger } from '../../logger';

const playCommand : Command = {
	name: 'play',
	aliases: ['play-song', 'add'],
	description: 'Riproduce video o playlist da soundcloud',
	args: [
		{
			key: 'query',
			label: 'link del video/playlist o video da cercare',
			prompt: 'Inserisci un link di una musica o playlist o il titolo di un musica',
			type: 'string',
		},
	],

	async run(message: Message, { query } : { query : string}) {
		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			logger.warn('User isn\'t in a voice channel');
			return message.reply('Devi essere in un canale plebeo');
		}

		// Video per playlist
		if (scdl.isPlaylistURL(query) && query.includes('/sets/')) {
			logger.info('Query is a playlist');

			const playlist = await scdl.getSetInfo(query).catch((err) => {
				logger.error(err);
				throw new pError('La playlist è privata oppure è un fantasma');
			});

			for(let i = 0; i < playlist.track_count; i++) {
				if(!playlist.tracks[i].public) {
					logger.warn(`video ${playlist.tracks[i].permalink_url} is private`);
					continue;
				}
				else{
					try{
						logger.info(`Fetching video ${playlist.tracks[i].permalink_url}`);
						const video = playlist.tracks[i];
						logger.verbose(video);
						const cVideoObj = constructVideoObj(video, voiceChannel as VoiceChannel, message.member.user);
						logger.verbose(cVideoObj);
						logger.info('Added video to guild queue');
						pushToQueue(message.guildId, cVideoObj);
					}
					catch (err) {
						logger.error(err);
					}
				}
			}

			if(!getMusicHandler(message.guild.id).isPlaying) {
				getMusicHandler(message.guild.id).isPlaying = true;
				playSong(getMusicHandler(message.guild.id).queue, message);
			}
			else{
				message.channel.send(`Playlist - :musical_note:  ${playlist.label_name} :musical_note: è stata aggiunta alla queue`);
			}

			return;
		}

		// Video per URL
		if (scdl.isValidUrl(query)) {
			logger.info('query is video');

			let video : TrackInfo;
			try {
				video = await scdl.getInfo(query);
			}
			catch (err) {
				logger.error(err);
				return message.reply('Impossibile riprodurre il video dato');
			}

			logger.verbose(video);

			logger.info('Pushing video to queue');
			pushToQueue(message.guildId, constructVideoObj(video, voiceChannel as VoiceChannel, message.member.user));

			if(!getMusicHandler(message.guild.id).isPlaying) {
				getMusicHandler(message.guild.id).isPlaying = true;
				return playSong(getMusicHandler(message.guild.id).queue, message);
			}
			else{
				return message.channel.send(`${video.title} aggiunta alla queue`);
			}
		}

		// Video per ricerca

		logger.info('query is search query');
		const videos = await scdl.search({ limit: 5, query }).catch(() => { throw new pError('C\'è stato un problema a cercare il video bruh'); });
		logger.verbose(videos);

		if(videos.collection.length < 5 || !videos) {
			logger.warn('Could not find any video');
			return await message.channel.send('Devi capire che ho dei problemi sii più specifico o esplodi');
		}

		const vidNameArr : string[] = [];
		for (let i = 0; i < videos.collection.length; i++) {
			const video = await scdl.getInfo(videos.collection[i].permalink_url);
			vidNameArr.push(video.title);
		}

		const embed = new MessageEmbed()
			.setColor('#e9f931')
			.setTitle('Scegli la canzone tramite i pulsanti')
			.addField('1', vidNameArr[0])
			.addField('2', vidNameArr[1])
			.addField('3', vidNameArr[2])
			.addField('4', vidNameArr[3])
			.addField('5', vidNameArr[4])
			.addField('Esci', 'exit');

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton().setCustomId('1').setLabel('1️⃣').setStyle('SUCCESS'),
				new MessageButton().setCustomId('2').setLabel('2️⃣').setStyle('SUCCESS'),
				new MessageButton().setCustomId('3').setLabel('3️⃣').setStyle('SUCCESS'),
				new MessageButton().setCustomId('4').setLabel('4️⃣').setStyle('SUCCESS'),
				new MessageButton().setCustomId('5').setLabel('5️⃣').setStyle('SUCCESS'),
			);

		const exitRow = new MessageActionRow()
			.addComponents(
				new MessageButton().setCustomId('exit').setLabel('❌').setStyle('DANGER'),
			);

		logger.info('sending video chooser');
		const songEmbed = await message.channel.send({ embeds : [ embed ], components: [ row, exitRow ] });

		const filter = (i : MessageComponentInteraction) => i.user.id == message.member.user.id && i.componentType == 'BUTTON';

		const collected = await songEmbed.awaitMessageComponent({ filter, time: 20000 }).catch(() => {
			logger.warn('User did not respond in time');
			songEmbed.delete();
			throw new pError('');
		});

		if(collected.customId == 'exit') {
			logger.info('User canceled interaction');
			return await songEmbed.delete();
		}

		const videoIndex = +collected.customId;

		const video = await scdl.getInfo(videos.collection[videoIndex - 1].permalink_url);
		logger.verbose(video);

		logger.info('Pushing video to queue');
		pushToQueue(message.guildId, constructVideoObj(video, voiceChannel as VoiceChannel, message.member.user));

		await songEmbed.delete();

		if(getMusicHandler(message.guild.id) && !getMusicHandler(message.guild.id).isPlaying) {
			getMusicHandler(message.guild.id).isPlaying = true;
			return playSong(getMusicHandler(message.guild.id).queue, message);
		}
		else {
			return await message.channel.send(`${video.title} aggiunta alla queue`);
		}
	},
};


const playSong = async (queue : videoObj[], message : Message) => {
	logger.info('Joining voice channel');
	const connection = await joinVoiceChannel({
		channelId: queue[0].voiceChannel.id,
		guildId: queue[0].voiceChannel.guildId,
		adapterCreator: queue[0].voiceChannel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
	});

	logger.info('Creating resources');
	const resource = createAudioResource(await scdl.download(queue[0].url), { inputType: StreamType.Arbitrary, inlineVolume: true });
	logger.verbose(resource);
	const player = createAudioPlayer();
	logger.verbose(player);

	player.play(resource);

	const dispatcher = connection.subscribe(player);

	let fixFlag = true;

	player.on(AudioPlayerStatus.Playing, async () => {
		if(!fixFlag) return;
		fixFlag = false;
		logger.info('Started resource playback');
		getMusicHandler(message.guild.id).songDispatcher = dispatcher;
		logger.info(`Setting previous volume ${getMusicHandler(message.guild.id).volume}`);
		((getMusicHandler(message.guild.id).songDispatcher.player.state as any).resource as AudioResource).volume.setVolume(getMusicHandler(message.guild.id).volume);


		logger.info('sending user info');
		const videoEmbed = new MessageEmbed()
			.setThumbnail(queue[0].thumbnail)
			.setColor('#e9f931')
			.addField('Ora riproducendo:', queue[0].title)
			.addField('Durata:', queue[0].duration)
			.setFooter(
				`Richiesta da ${queue[0].memberDisplayName}`,
				queue[0].memberAvatar
			);

		if (queue[1]) videoEmbed.addField('Prossima canzone:', queue[1].title);

		await message.channel.send({ embeds: [ videoEmbed ] });

		getMusicHandler(message.guild.id).nowPlaying = queue[0];

		queue.shift();
		return;
	});

	player.on(AudioPlayerStatus.Idle, () => {
		logger.info('Stopped resource playback');
		try {
			if(getMusicHandler(message.guild.id)) {
				queue = getMusicHandler(message.guild.id).queue;
				if(queue.length > 0) {
					logger.info('Playing next song');
					playSong(queue, message);
					return;
				}
				else {
					logger.info('Deleting guild musichandler');
					if(getMusicHandler(message.guild.id).songDispatcher) getMusicHandler(message.guild.id).songDispatcher.connection.destroy();
					music.delete(message.guildId);
				}
			}
		}
		catch (error) {
			throw new Error((error as Error).message);
		}
	});

	player.on('error', (err) => {
		logger.error(err);
		logger.info('Deleting guild musichandler');
		message.channel.send('Non posso riprodurre quella canzone');
		getMusicHandler(message.guild.id).songDispatcher.connection.destroy();
		music.delete(message.guildId);
		return;
	});


};

const constructVideoObj = (video : TrackInfo, voiceChannel : VoiceChannel, user : User) : videoObj => {
	let duration = formatDuration(video.duration);
	if(duration == '00:00') duration = 'livestream';
	console.log(video.artwork_url);

	return {
		url: video.permalink_url,
		title: video.title,
		rawDuration: video.duration,
		duration,
		thumbnail: video.artwork_url,
		voiceChannel,
		memberDisplayName: user.username,
		memberAvatar: user.avatarURL({ size: 16 }),
	};
};

const formatDuration = (duration : number) : string => {
	let formattedDate = new Date(duration).toISOString().substr(11, 8);
	while(formattedDate.startsWith('00:')) {
		formattedDate = formattedDate.substr(3);
	}
	return formattedDate;
};

module.exports = playCommand;