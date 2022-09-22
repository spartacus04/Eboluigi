import { Client, GatewayIntentBits, Message, Partials } from 'discord.js';
import { music, musicGuild } from '../musicHandler';

export interface argument{
    key: string,
    label: string,
    prompt: string,
    type: string,
}

export interface Command{
    name: string,
    aliases ?: string[],
    description : string,
    adminOnly?: boolean,
    founderOnly?: boolean,
    category?: string,

    args?: argument[],

    run : (message : Message, args ?: any) => Promise<any>
}

export interface Listener {
	deferred: boolean,

	register: () => void,
	unregister?: () => void,
}

export class eClient extends Client {
	commands: Command[];
	groups: string[];
}

export const getMusicHandler = (guildId : string) : musicGuild => {
	return music.get(guildId);
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

export const {
	ADMIN_ROLE_ID,
} = process.env;