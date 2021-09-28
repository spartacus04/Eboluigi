import { VoiceState } from 'discord.js';
import { client } from '../config';
import { music } from '../musicHandler';

client.on('voiceStateUpdate', (_ : VoiceState, newState : VoiceState) => {
	const guildId = newState.guild.id;

	if(newState.member.user.bot && !newState.channelId && music.get(guildId) && music.get(guildId).songDispatcher && newState.member.user.id == client.user.id) {
		music.delete(guildId);
	}
});