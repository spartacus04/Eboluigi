import { format } from 'winston';
import { stringify } from 'flatted';

export const prettyPrint = format.printf(({ timestamp, level, message }) => {
	return `[${timestamp} ${level}]: ${message}`;
});

export const flat = format.printf(info => {
	if (typeof info.message === 'object') {
		info.message = stringify(info.message, null, 4);
	}

	return info.message;
});