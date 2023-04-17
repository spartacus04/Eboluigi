import fs from 'node:fs';
import path from 'node:path';
import { Message, EmbedBuilder } from 'discord.js';
import { Command, client } from '@commandHandler';

const infoCommand: Command = {
	name: 'info',
	description: 'Invia informazioni su Eboluigi',

	async run(message: Message) {
		const { version } = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
		const gitHash = fs.readFileSync(path.join(process.cwd(), '.git/FETCH_HEAD'), 'utf8').substring(0, 6);

		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle('Informazioni su Eboluigi')
			.addFields([
				{ name: 'Nome', value: 'Eboluigi' },
				{ name: 'Versione', value: version },
				{ name: 'Git Hash', value: gitHash },
				{ name: 'Autore', value: 'Spartacus04' },
				{ name: 'Descrizione', value: 'Eboluigi è un bot discord che ti aiuta a gestire il tuo server' },
				{ name: 'Uptime', value: client.uptime.toString() },
			]);

		message.channel.send({
			embeds: [embed],
		});
	},
};

module.exports = infoCommand;
