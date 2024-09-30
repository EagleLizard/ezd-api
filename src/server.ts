
import Koa from 'koa';
import KoaRouter from '@koa/router';

import { config } from './config';
import { Timer } from './util/timer';
import { addRoutes } from './routes';

export async function initServer(): Promise<void> {
  let app: Koa;
  let router: KoaRouter;

  app = new Koa();
  router = new KoaRouter();

  app.use(async (ctx, next) => {
    let reqTimer: Timer;
    let reqMs: number;
    reqTimer = Timer.start();
    await next();
    reqMs = reqTimer.stop();
    console.log(`${ctx.method} ${ctx.url} - ${reqMs}`);
  });

  router = addRoutes(router);

  app.use(router.routes());

  console.log(`Listening on ${config.EZD_HOST}:${config.EZD_PORT}`);
  app.listen({
    host: config.EZD_HOST,
    port: config.EZD_PORT,
  });
}
