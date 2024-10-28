import { FastifyReply, FastifyRequest } from 'fastify';
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
  let jcdProjectDto = await JcdProjectService.getProject(req.params.projectRoute);
  res.send(jcdProjectDto);
}
