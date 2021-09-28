import { PlayerSubscription } from '@discordjs/voice';
import { Collection, VoiceChannel } from 'discord.js';
import { logger } from './logger';

export interface videoObj{
    url: string,
    title: string,
    rawDuration: number,
    duration: string,
    thumbnail: string,
    voiceChannel : VoiceChannel,
    memberDisplayName: string,
    memberAvatar: string
}

export interface musicGuild{
    queue: videoObj[],
    isPlaying: boolean,
    nowPlaying : videoObj,
    songDispatcher : PlayerSubscription,
    volume : number
}

export const music = new Collection<string, musicGuild>();

export const pushToQueue = (guildId : string, video : videoObj) : void => {
	const guild = music.get(guildId);
	if(!guild) {
		logger.info('Creating guild musicHandler');
		music.set(guildId, {
			queue: [],
			isPlaying: false,
			nowPlaying: null,
			songDispatcher: null,
			volume: 1,
		});
	}
	music.get(guildId).queue.push(video);
};
