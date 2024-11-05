
import type { FastifyReply, FastifyRequest } from 'fastify';
import { isString } from '../../util/validate-primitives';
import { ImageService, ImageStreamRes } from '../../service/image-service';

export async function getImageCtrl(
  req: FastifyRequest<{
    Params: {
      '*'?: string,
    };
    Querystring: {
      sz?: string;
      width?: string;
      height?: string;
    };
  }>,
  res: FastifyReply
) {
  let imagePathParam: string;
  let szParam: string | undefined;
  let widthParam: number | undefined;
  let heightParam: number | undefined;
  let imageStreamRes: ImageStreamRes;

  if(
    !isString(req.params['*'])
    || (req.params['*'].length < 1)
  ) {
    return res.status(404).send();
  }
  imagePathParam = req.params['*'];
  szParam = req.query.sz;
  widthParam = (isString(req.query.width) && !isNaN(+req.query.width))
    ? +req.query.width
    : undefined
  ;
  heightParam = (isString(req.query.height) && !isNaN(+req.query.height))
    ? +req.query.height
    : undefined
  ;

  imageStreamRes = await ImageService.getImage({
    imagePath: imagePathParam,
    sz: szParam,
    width: widthParam,
    height: heightParam,
  });
  res.header('content-type', imageStreamRes.headers['content-type']);
  return res.send(imageStreamRes.stream);
}
