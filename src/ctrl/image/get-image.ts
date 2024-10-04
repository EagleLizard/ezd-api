
import { Context } from 'hono';
import { stream as hStream } from 'hono/streaming';
import { BlankEnv, BlankInput } from 'hono/types';

export async function getImageCtrl(c: Context<BlankEnv, '', BlankInput>) {
  let imgResp: Response;
  let imgPath: string;
  let contentType: string | null;
  let imageParam = c.req.param('etc');
  console.log({
    imageParam
  });
  imgPath = 'bigbird.jpg';
  imgResp = await fetch(`http://127.0.0.1:4445/img-v0/${imgPath}`);
  contentType = imgResp.headers.get('content-type');
  if(contentType === null) {
    throw new Error('null response body when fetching stream');
  }
  c.header('Content-Type', contentType);
  return hStream(c, (stream) => {
    /*
      see: https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/65542#discussioncomment-6071004
    */
    return stream.pipe(imgResp.body as ReadableStream<Uint8Array>);
  });
}
