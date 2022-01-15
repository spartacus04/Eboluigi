import { Client, Intents, Message } from 'discord.js';
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

export class eClient extends Client {
    commands: Command[];
    groups: string[];
}

export const getMusicHandler = (guildId : string) : musicGuild => {
	return music.get(guildId);
};

export const client = new eClient({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_VOICE_STATES],
});

export const {
	ADMIN_ROLE_ID,
} = process.env;