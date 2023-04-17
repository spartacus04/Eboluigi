import fs from 'node:fs';
import path from 'node:path';
import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '../shared';

const tposeCommand: Command = {
	name: 'tpose',
	description: 'Risponde con una T-Pose',

	async run(message: Message) {
		const files = fs.readdirSync(path.join(process.cwd(), '/resources/images/tpose'));
		const fileName = files[Math.floor(Math.random() * files.length)];

		fileCommand(message, `resources/images/tpose/${fileName}`);
	},
};

module.exports = tposeCommand;
