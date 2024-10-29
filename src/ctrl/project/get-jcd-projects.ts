
import type { FastifyReply, FastifyRequest } from 'fastify';
import { JcdProjectDb } from '../../service/db/jcd-project-db';

export async function getJcdProjectsCtrl(
  req: FastifyRequest,
  res: FastifyReply,
) {
  let jcdProjects = await JcdProjectDb.getProjects();
  return res.status(200).send(jcdProjects);
}
