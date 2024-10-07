import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getImageCtrl(
  req: FastifyRequest<{
    Params: {
      imagePath?: string,
    }
  }>,
  res: FastifyReply
) {
  let imgResp: Response;
  let imgPath: string;
  let contentType: string | null;
  let imageParam = req.params.imagePath;
  console.log({
    imageParam
  });
  imgPath = 'bigbird.jpg';
  imgResp = await fetch(`http://127.0.0.1:4445/img-v0/${imgPath}`);
  res.header('Content-Type', imgResp.headers.get('content-type'));
  return res.send(imgResp.body);
}

// function getResizeStream(stream)
