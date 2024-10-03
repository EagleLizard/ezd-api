
import { MiddlewareHandler } from 'hono';
import { getConnInfo } from '@hono/node-server/conninfo';
import { logger as pinoLogger } from '../lib/logger';

import { Timer } from '../util/timer';

/*
{
  "level": 30,
  "time": 1727826145232,
  "pid": 2608,
  "hostname": "Tylers-MacBook-Pro-3.local",
  "reqId": "req-2",
  "req": {
    "method": "GET",
    "url": "/v1/health",
    "hostname": "0.0.0.0:4270",
    "remoteAddress": "127.0.0.1",
    "remotePort": 51888
  },
  "msg": "incoming request"
}
{
  "level": 30,
  "time": 1727826145233,
  "pid": 2608,
  "hostname": "Tylers-MacBook-Pro-3.local",
  "reqId": "req-2",
  "res": {
    "statusCode": 200
  },
  "responseTime": 0.8628749847412109,
  "msg": "request completed"
}
*/

export function logMiddleware(): MiddlewareHandler {
  let idCounter = 0;
  let getReqId: () => string;
  /*
    should probably do something smarter than this. This is
      similar to default fastify logging.
   */
  getReqId = () => {
    return `req-${(idCounter++).toString(36)}`;
  };
  return async (c, next) => {
    let startTime = process.hrtime.bigint();
    let connInfo = getConnInfo(c);
    let reqId = getReqId();
    pinoLogger.info({
      reqId,
      req: {
        method: c.req.method,
        url: c.req.path,
        addressType: connInfo.remote.addressType,
        hostname: connInfo.remote.address,
        remotePort: connInfo.remote.port,
      }
    }, 'incoming request');
    await next();
    let endTime = process.hrtime.bigint();
    let reqMs = Timer.getDeltaMs(startTime, endTime);
    let logStr = `[${reqId}] ${c.req.method} ${c.req.path} ${c.res.status} - ${reqMs}`;
    pinoLogger.info({
      reqId,
      res: {
        statusCode: 200
      },
    }, logStr);
    console.log(logStr);
  };
}
