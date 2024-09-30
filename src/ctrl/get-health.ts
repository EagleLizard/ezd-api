
import Koa from 'koa';

export function getHealthCtrl(ctx: Koa.Context, next: Koa.Next) {
  ctx.body = {
    status: 'ok',
  };
  ctx.status = 200;
}
