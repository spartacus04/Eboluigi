export const { NODE_ENV } = process.env;

export const isDevelopment = NODE_ENV === 'dev';
export const isProduction = !isDevelopment;
