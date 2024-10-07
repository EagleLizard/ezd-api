
import { FastifyReply, FastifyRequest } from 'fastify';

export function getErrorCtrl(req: FastifyRequest, res: FastifyReply) {
  if(Math.random() > 0) {
    throw new Error('Oops!');
  }
  res.send({
    status: 'ok',
  });
}
