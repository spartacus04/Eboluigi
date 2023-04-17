import { isProduction } from '@config';
import { createDevLogger } from './development';
import { createProdLogger } from './production';

const getLogger = () => (isProduction ? createProdLogger() : createDevLogger());

export const logger = getLogger();
