import { Message, TextChannel } from 'discord.js';

export const fileCommand = async (message: Message, file: string) => {
	await (<TextChannel>message.channel).sendTyping();
	await (<TextChannel>message.channel).send({ files: [ file ] });
};