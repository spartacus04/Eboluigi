import winston, { format, transports } from 'winston';
const { combine } = format;

const prettyPrint = format.printf(({ timestamp, level, message }) => {
	return `[${timestamp} ${level}]: ${message}`;
});

export const createProdLogger = () : winston.Logger => {
	return winston.createLogger({
		level: 'verbose',
		format: combine(
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