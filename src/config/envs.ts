import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  //DB
  DATABASE_URL: string;

  //PRODUCT
  //PRODUCTS_MS_HOST: string;
  //PRODUCTS_MS_PORT: number;

  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    DATABASE_URL: joi.string().required(),

    //PRODUCTS_MS_PORT: joi.number().required(),
    //PRODUCTS_MS_HOST: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config Validation Error ENV ${error.message}`);
}

const enVars: EnvVars = value;

export const envs: EnvVars = {
  PORT: enVars.PORT,

  DATABASE_URL: enVars.DATABASE_URL,

  //PRODUCTS_MS_HOST: enVars.PRODUCTS_MS_HOST,
  //PRODUCTS_MS_PORT: enVars.PRODUCTS_MS_PORT,
  NATS_SERVERS: enVars.NATS_SERVERS,
};
