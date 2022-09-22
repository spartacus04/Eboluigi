import winston, { format, transports } from 'winston';
const { combine } = format;
import { stringify } from 'flatted';

const prettyPrint = format.printf(({ timestamp, level, message }) => {
	return `[${timestamp} ${level}]: ${message}`;
});

export const createDevLogger = () : winston.Logger => {
	return winston.createLogger({
		level: 'info',
		format: combine(
			format.colorize(),
			format.timestamp(),
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
		],
	});
};