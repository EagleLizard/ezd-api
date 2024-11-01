
import type { FastifyRequest, FastifyReply } from 'fastify';
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
  let jcdGalleryImages = await JcdImageService.getGalleryImagesByKey({
    galleryKey: req.params.projectKey,
  });
  res.send(jcdGalleryImages);
}

