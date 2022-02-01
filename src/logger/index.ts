import { createDevLogger } from './development';
import { createProdLogger } from './production';

const getLogger = () => {
	if (process.env.NODE_ENV === 'production') {
		return createProdLogger();
	}

	return createDevLogger();
};

export const logger = getLogger();