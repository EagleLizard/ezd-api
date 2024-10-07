
import path from 'path/posix';
import { Readable } from 'stream';
import webStream from 'node:stream/web';

import { config } from '../config';
import { DEFAULT_IMG_SZ, ImgSz, validateImgSz } from '../lib/models/img-sz';

export type GetImageOpts = {
  imagePath: string;
  sz?: string;
};

export type ImageStreamRes = {
  stream: Readable;
  headers: Record<string, string>;
};

export const ImageService = {
  getImage,
} as const;

async function getImage(opts: GetImageOpts): Promise<ImageStreamRes> {
  let imagePath: string;
  let imageStreamRes: ImageStreamRes;
  let sz: ImgSz;

  sz = validateImgSz(opts.sz)
    ? opts.sz
    : DEFAULT_IMG_SZ
  ;
  imagePath = [ sz, opts.imagePath ].join(path.sep);
  if(config.EZD_ENV === 'DEV') {
    imageStreamRes = await getDevStream(imagePath);
  } else {
    // TODO: implement aws
    throw new Error('real impl');
  }
  return imageStreamRes;
}

async function getDevStream(imagePath: string): Promise<ImageStreamRes> {
  let imgUrl: string;
  let imageReadStream: Readable;
  let resp: Response;
  let headers: Record<string, string>;
  let contentType: string | null;

  headers = {};
  imgUrl = `http://${config.SFS_HOST}:${config.SFS_PORT}/${imagePath}`;
  resp = await fetch(imgUrl);
  if(resp.body === null) {
    throw new Error(`null body when fetching: ${imagePath}`);
  }
  imageReadStream = Readable.fromWeb(resp.body as webStream.ReadableStream<Uint8Array>);
  contentType = resp.headers.get('content-type');
  if(contentType !== null) {
    headers['content-type'] = contentType;
  }
  return {
    stream: imageReadStream,
    headers,
  };
}
