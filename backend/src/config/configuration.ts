import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1d'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  THROTTLE_TTL: Joi.number().default(process.env.THROTTLE_TTL || 60),
  THROTTLE_LIMIT: Joi.number().default(process.env.THROTTLE_LIMIT || 10),
});

export const appConfig = registerAs('app', () => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  return {
    port,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:80',
    throttle: {
      ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
      limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
    },
  };
});

export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/easy-generator',
}));

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '15d',
}));