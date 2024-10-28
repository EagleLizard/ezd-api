
import type { FastifyReply, FastifyRequest } from 'fastify';
import { JcdProjectService } from '../../service/jcd-project-service';

export async function getJcdProjectCtrl(
  req: FastifyRequest,
  res: FastifyReply,
) {
  let jcdProjects = await JcdProjectService.getProjects();
  return res.status(200).send(jcdProjects);
}
