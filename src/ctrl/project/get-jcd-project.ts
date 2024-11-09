import type { FastifyReply, FastifyRequest } from 'fastify';
import { JcdProjectService } from '../../service/jcd-project-service';

export async function getJcdProjectCtrl(
  req: FastifyRequest<{
    Params: {
      projectRoute?: string;
    };
  }>,
  res: FastifyReply,
) {
  if(req.params.projectRoute === undefined) {
    return res.send(404);
  }
  let jcdProjectDto = await JcdProjectService.getProjectByRoute(req.params.projectRoute);
  res.send(jcdProjectDto);
}
