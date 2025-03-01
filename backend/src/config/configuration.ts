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
});

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
}));

export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
}));

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
})); 