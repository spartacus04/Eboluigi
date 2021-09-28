import { Command } from '../../config';
import { Message } from 'discord.js';
import { logger } from '../../logger';

const evalCommand : Command = {
	name: 'eval',
	aliases: ['evaluate'],
	description: 'Esegue javascript',
	adminOnly: true,
	args: [
		{
			key: 'toevaluate',
			label: 'codice da eseguire',
			prompt: 'Cosa vuoi eseguire?',
			type: 'string',
		},
	],

	run(message : Message, { toevaluate } : { toevaluate : string }) {
		if(message.guild.id != '711540165012881438') {
			logger.warn(`guild ${message.guild.id} isn't allowed to run eval`);
			return message.channel.send('Non posso eseguire questo comando in questo server');
		}

		try {
			logger.info(`Evaluating ${toevaluate}`);
			const evalResult = eval(toevaluate);
			message.channel.send('```' + evalResult + '```');
		}
		catch (err) {
			logger.error(err);
			message.channel.send('```' + err + '```');
		}
	},
};

module.exports = evalCommand;