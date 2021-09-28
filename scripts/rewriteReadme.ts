import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { Command } from '../src/config';
import { getGroups } from '../src/util';

const main = async () => {

	const readmePath = path.join(__dirname, '../README.md');

	if(fs.existsSync(readmePath)) fs.rmSync(readmePath);

	fs.writeFileSync(readmePath, fs.readFileSync(path.join(__dirname, '../resources/scripts/README-template.md'), 'utf-8'));

	const groups = getGroups();


	for(let i = 0; i < groups.length; i++) {
		const group = groups[i];

		fs.appendFileSync(readmePath, `\n### ${group}\n`);
		const commandFiles = fs.readdirSync(path.join(__dirname, `../src/commands/${group}/`));

		await commandFiles.forEach(async cmd => {
			const command : Command = await import(`../src/commands/${group}/${cmd}`);

			let commandLine = `  - m.${command.name}`;

			if(command.aliases) {
				command.aliases.forEach(alias => {
					commandLine += `/${alias}`;
				});
			}

			if(command.args) {
				command.args.forEach(arg => {
					commandLine += ` <${arg.label}>`;
				});
			}

			commandLine += ` : ${command.description}\n`;
			fs.appendFileSync(readmePath, commandLine);
		});


		await new Promise(res => setTimeout(res, 1000));

	}
};

main();