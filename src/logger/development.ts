import winston, { format, transports } from 'winston';
const { combine } = format;

const prettyPrint = format.printf(({ timestamp, level, message }) => {
	return `[${timestamp} ${level}]: ${message}`;
});

export const createDevLogger = () : winston.Logger => {
	return winston.createLogger({
		level: 'info',
		format: combine(
			format.colorize(),
			format.timestamp(),
			prettyPrint,
		),
		transports: [
			new transports.Console(),
			new transports.File({
				filename: 'combined.log',
				level: 'info',
			}),
			new transports.File({
				filename: 'verbose.log',
				level: 'verbose',
			}),
		],
	});
};