import winston, { format, transports } from 'winston';
import { flat, prettyPrint } from './shared';

export const createDevLogger = (): winston.Logger => {
	return winston.createLogger({
		level: 'info',
		format: format.combine(
			format.colorize(),
			format.timestamp(),
			flat,
			prettyPrint,
		),
		transports: [new transports.Console()],
	});
};
