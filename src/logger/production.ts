import winston, { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { flat, prettyPrint } from './shared';

process.stdout.pipe(process.stdout);

export const createProdLogger = (): winston.Logger => {
	return winston.createLogger({
		level: 'info',
		format: format.combine(
			format.timestamp(),
			format.json(),
			flat,
			prettyPrint,
		),
		transports: [
			new transports.Console({
				format: format.combine(
					format.colorize(),
					format.timestamp(),
					format.json(),
					flat,
					prettyPrint,
				),
			}),
			new DailyRotateFile({
				filename: 'debug-%DATE%.log',
				datePattern: 'YYYY-MM-DD-HH',
				zippedArchive: false,
				dirname: 'logs',
				maxFiles: '1d',
				level: 'info',
			}),
		],
	});
};
