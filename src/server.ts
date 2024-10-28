
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

import { addRoutes } from './routes';
import { config } from './config';
import { logger } from './lib/logger';

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
