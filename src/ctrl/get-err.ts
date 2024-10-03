
import { Context } from 'hono';
import { logger } from '../lib/logger';
import { isError } from '../util/validate-primitives';

export function getErrorCtrl(c: Context) {
  console.log(logger.levels);
  if(Math.random() > 0) {
    throw new Error('Oops!');
  }
  return c.json({
    status: 'ok',
  });
}
