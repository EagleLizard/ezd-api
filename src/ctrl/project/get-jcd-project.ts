import { FastifyReply, FastifyRequest } from 'fastify';
import { JcdProjectDb } from '../../service/db/jcd-project-db';
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
  let jcdProjectDto = await JcdProjectDb.getProjectBase(req.params.projectRoute);
  let jcdProject = await JcdProjectService.getProject(jcdProjectDto);
  res.send(jcdProject);
}
