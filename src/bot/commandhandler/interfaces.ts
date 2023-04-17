import { Message, GatewayIntentBits, Partials } from 'discord.js';
import { eClient } from './eclient';
import { music, musicGuild } from './musicHandler';

export interface argument {
	key: string;
	label: string;
	prompt: string;
	type: string;
}

export interface Command {
	name: string;
	aliases?: string[];
	description: string;
	adminOnly?: boolean;
	founderOnly?: boolean;
	category?: string;
	deferred?: boolean;

	args?: argument[];

	run: (message: Message, args?: any) => Promise<any>;
}

export interface Listener {
	deferred: boolean;

	register: () => void;
	unregister?: () => void;
}

export const getMusicHandler = (id: string): musicGuild => {
	return music.get(id);
};

export const client = new eClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.User,
		Partials.Reaction,
	],
});
