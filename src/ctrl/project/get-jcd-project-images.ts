
import type { FastifyRequest, FastifyReply } from 'fastify';
import { JcdProjectDb } from '../../service/db/jcd-project-db';
import { JcdImageService } from '../../service/jcd-image-service';

export async function getJcdProjectImagesCtrl(
  req: FastifyRequest<{
    Params: {
      projectKey?: string;
    };
  }>,
  res: FastifyReply,
) {
  if(req.params.projectKey === undefined) {
    return res.send(404);
  }
  let jcdProjectBaseDto = await JcdProjectDb.getProjectByKey(req.params.projectKey);
  let jcdProjectImages = await JcdImageService.getProjectImages({
    jcd_project_id: jcdProjectBaseDto.jcd_project_id,
    jcd_project_key: jcdProjectBaseDto.project_key,
  });
  res.send(jcdProjectImages);
}

