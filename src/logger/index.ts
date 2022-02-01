import { IN_PROD } from '../config';
import { createDevLogger } from './development';
import { createProdLogger } from './production';

export const logger = IN_PROD ? createProdLogger() : createDevLogger();