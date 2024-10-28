
import dotenv from 'dotenv';
import { isString } from './util/validate-primitives';
dotenv.config();

const config = {
  EZD_ENV: getEnvVarOrErr('EZD_ENV'),
  EZD_HOST: getEnvVarOrErr('EZD_HOST'),
  EZD_PORT: getNumberEnvVar('EZD_PORT'),

  POSTGRES_HOST: getEnvVarOrErr('POSTGRES_HOST'),
  POSTGRES_PORT: getNumberEnvVar('POSTGRES_PORT'),
  POSTGRES_USER: getEnvVarOrErr('POSTGRES_USER'),
  POSTGRES_PASSWORD: getEnvVarOrErr('POSTGRES_PASSWORD'),
  POSTGRES_DB: getEnvVarOrErr('POSTGRES_DB'),

  SFS_HOST: process.env['SFS_HOST'],
  SFS_PORT: process.env['SFS_PORT'],
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
