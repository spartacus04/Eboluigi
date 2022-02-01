import winston, { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { stringify } from 'flatted';


const { combine } = format;

const prettyPrint = format.printf(({ timestamp, level, message }) => {
	return `[${timestamp} ${level}]: ${message}`;
});

export const createProdLogger = () : winston.Logger => {
	return winston.createLogger({
		level: 'verbose',
		format: combine(
			format.timestamp(),
			format.json(),
			format.printf((info) => {
				if (typeof info.message === 'object') {
					info.message = stringify(info.message, null, 4);
				}

				return info.message;
			}),
			prettyPrint,
		),
		transports: [
			new transports.Console(),
			new DailyRotateFile({
				filename: 'combined-%DATE%.log',
				datePattern: 'YYYY-MM-DD-HH',
				zippedArchive: true,
				dirname: 'logs',
				maxFiles: '1d',
				level: 'verbose',
			}),
			new DailyRotateFile({
				filename: 'debug-%DATE%.log',
				datePattern: 'YYYY-MM-DD-HH',
				zippedArchive: false,
				dirname: 'logs',
				maxFiles: '1d',
				level: 'info',
			}),
			new DailyRotateFile({
				filename: 'errors-%DATE%.log',
				datePattern: 'YYYY-MM-DD',
				zippedArchive: false,
				dirname: 'logs',
				maxFiles: '1d',
				level: 'error',
			}),
		],
	});
};