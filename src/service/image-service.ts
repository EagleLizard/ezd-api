
import path from 'path/posix';
import { Readable } from 'stream';
import http from 'http';

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
  let headers: Record<string, string>;

  if(config.SFS_HOST === undefined) {
    throw new Error(`Missing required env var: ${config.SFS_HOST}`);
  }
  if(config.SFS_PORT === undefined) {
    throw new Error(`Missing required env var: ${config.SFS_PORT}`);
  }

  headers = {};
  imgUrl = `http://${config.SFS_HOST}:${config.SFS_PORT}/${imagePath}`;

  let req = http.request(imgUrl, {
    method: 'GET',
  });
  req.end();
  let res = await new Promise<http.IncomingMessage>((resolve, reject) => {
    req.once('error', reject);
    req.once('response', resolve);
  });
  if(res.headers['content-type'] !== undefined) {
    headers['content-type'] = res.headers['content-type'];
  }
  if(res.headers['content-length'] !== undefined) {
    headers['content-length'] = res.headers['content-length'];
  }
  return {
    stream: res,
    headers,
  };
}
