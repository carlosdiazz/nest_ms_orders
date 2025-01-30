import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  //DB
  DATABASE_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config Validation Error ENV ${error.message}`);
}

const enVars: EnvVars = value;

export const envs: EnvVars = {
  PORT: enVars.PORT,

  DATABASE_URL: enVars.DATABASE_URL,
};
