import path from 'path';

import pino, { LoggerOptions } from 'pino';

import { config } from '../config';
import { LOG_DIR_PATH } from '../constants';
import { mkdirIfNotExist } from '../util/files';
import { FastifyBaseLogger } from 'fastify';

const APP_LOG_FILE_NAME = 'app.log';
const APP_LOG_FILE_PATH = [
  LOG_DIR_PATH,
  APP_LOG_FILE_NAME,
].join(path.sep);

const APP_ERROR_LOG_FILE_NAME = 'app.error.log';
const APP_ERROR_LOG_FILE_PATH = [
  LOG_DIR_PATH,
  APP_ERROR_LOG_FILE_NAME,
].join(path.sep);

const devEnv = config.EZD_ENV === 'DEV';

const level = (devEnv)
  ? 'debug'
  : 'info'
;

export const logger = initLogger();

/*
  see: https://github.com/fastify/fastify/blob/ac462b2b4d859e88d029019869a9cb4b8626e6fd/lib/logger.js
*/
function initLogger() {
  let opts: LoggerOptions;
  let infoStream: pino.StreamEntry;
  let errStream: pino.StreamEntry | undefined;
  // let stream = pino.destination('./logs/app2.log');\
  if(devEnv) {
    mkdirIfNotExist(LOG_DIR_PATH);
    infoStream = {
      stream: pino.destination(APP_LOG_FILE_PATH)
    };
    errStream = {
      stream: pino.destination(APP_ERROR_LOG_FILE_PATH),
      level: 'error',
    };
  } else {
    infoStream = {
      stream: process.stdout,
    };
  }

  let streams: pino.StreamEntry[] = [
    infoStream,
    // {
    //   stream: process.stdout,
    //   level: 'debug',
    // },
    // {
    //   stream: process.stderr,
    //   level: 'error',
    // },
  ];
  if(errStream !== undefined) {
    streams.push(errStream);
  }
  let stream = pino.multistream(streams);
  opts = {
    level,
  };
  let logger2: FastifyBaseLogger = pino(opts, stream);
  return logger2;
}
