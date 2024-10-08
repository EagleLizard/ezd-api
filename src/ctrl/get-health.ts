
import type { FastifyRequest, FastifyReply } from 'fastify';

export function getHealthCtrl(req: FastifyRequest, res: FastifyReply) {
  return res.send({
    status: 'ok',
  });
}
