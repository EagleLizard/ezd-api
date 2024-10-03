
import { Hono } from 'hono';
import { serve as honoServe } from '@hono/node-server';

import { config } from './config';
import { addHRoutes } from './h-routes';
import { logMiddleware } from './middleware/log-middleware';

export async function initServer() {
  let app: Hono;
  app = new Hono();

  app.use(logMiddleware());

  addHRoutes(app);

  honoServe({
    port: config.EZD_PORT,
    hostname: config.EZD_HOST,
    fetch: app.fetch,
  }, (info) => {
    console.log(`Listening on ${info.address}:${info.port}`);
  });
}
