
import path from 'path/posix';

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';

import { addRoutes } from './routes';
import { config } from './config';
import { logger } from './lib/logger';
import { BASE_DIR } from './constants';

export async function initServer() {
  let app: FastifyInstance;
  let port: number;
  let host: string;

  app = Fastify({
    loggerInstance: logger,
  });

  /*
    Middleware
  _*/
  app.register(cors, {
    origin: '*',
    credentials: true,
  });

  // app.register(fastifyStatic, {
  //   root: [ BASE_DIR, 'jcd-web/dist' ].join(path.sep),
  //   prefix: '/', // default
  //   wildcard: false,
  // });

  /*
    Routes
  _*/

  addRoutes(app);

  host = config.EZD_HOST;
  port = config.EZD_PORT;
  try {
    await app.listen({ port, host });
    console.log(`Listening on ${host}:${port}`);
  } catch(e) {
    app.log.error(e);
    process.exit(1);
  }
}
