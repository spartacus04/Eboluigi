import { VoiceState } from 'discord.js';
import { client, Listener } from '../config';
import { music } from '../musicHandler';

const voiceStateUpdateHandler = async (_: VoiceState, newState: VoiceState) => {
	const guildId = newState.guild.id;

	if(newState.member.user.bot && !newState.channelId && music.get(guildId) && music.get(guildId).songDispatcher && newState.member.user.id == client.user.id) {
		music.delete(guildId);
	}
};

const voiceStateUpdateListener : Listener = {
	deferred: false,

	register: () => {
		client.on('voiceStateUpdate', voiceStateUpdateHandler);
	},

	unregister: () => {
		client.off('voiceStateUpdate', voiceStateUpdateHandler);
	},
};

module.exports = voiceStateUpdateListener;