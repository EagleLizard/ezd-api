
import dotenv from 'dotenv';
import { isString } from './util/validate-primitives';
dotenv.config();

const config = {
  EZD_ENV: process.env['EZD_ENV'],
  EZD_HOST: getEnvVarOrErr('EZD_HOST'),
  // EZD_HOST: process.env['EZD_HOST'] ?? '0.0.0.0',
  EZD_PORT: getNumberEnvVar('EZD_PORT'),

  POSTGRES_HOST: getEnvVarOrErr('POSTGRES_HOST'),
  // POSTGRES_HOST: process.env['POSTGRES_HOST'] ?? 'localhost',
  POSTGRES_PORT: getNumberEnvVar('POSTGRES_PORT'),
  POSTGRES_USER: getEnvVarOrErr('POSTGRES_USER'),
  POSTGRES_PASSWORD: process.env['POSTGRES_PASSWORD'],
  POSTGRES_DB: getEnvVarOrErr('POSTGRES_DB'),

  EZD_WEB_ORIGIN: getEnvVarOrErr('EZD_WEB_ORIGIN'),

  SFS_HOST: process.env['SFS_HOST'],
  SFS_PORT: process.env['SFS_PORT'],

  EZD_AWS_ACCESS_KEY_ID: process.env.EZD_AWS_ACCESS_KEY_ID,
  EZD_AWS_SECRET_ACCESS_KEY: process.env.EZD_AWS_SECRET_ACCESS_KEY,
  EZD_API_AWS_REGION: 'us-west-2',
  EZD_API_BUCKET_KEY: 'ezd-api-us-west-2-297608881144',
} as const;

export {
  config,
};

function getEnvVarOrErr(envKey: string): string {
  let rawEnvVar: string | undefined;
  rawEnvVar = process.env[envKey];
  if(!isString(rawEnvVar)) {
    throw new Error(`Invalid ${envKey}`);
  }
  return rawEnvVar;
}

function getNumberEnvVar(envKey: string): number {
  let rawPort: string;
  let portNum: number;
  rawPort = getEnvVarOrErr(envKey);
  portNum = +rawPort;
  if(isNaN(portNum)) {
    throw new Error(`invalid env var ${envKey}, expected 'number'`);
  }
  return portNum;
}
