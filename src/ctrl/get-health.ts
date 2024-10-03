import { Context } from 'hono';

export function getHealthCtrl(c: Context) {
  return c.json({
    status: 'ok',
  });
}
