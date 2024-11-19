
import path from 'path/posix';
import { Readable } from 'stream';
import http from 'http';

import { config } from '../config';
import { DEFAULT_IMG_SZ, ImgSz, imgSzFromDimensions, validateImgSz } from '../lib/models/img-sz';
import { AwsS3Client } from '../lib/aws/aws-s3-client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { JCD_IMG_V4_S3_PREFIX } from '../constants';

export type GetImageOpts = {} & {
  imagePath: string;
  sz?: string;
  width?: number;
  height?: number;
};

export type ImageStreamRes = {
  stream: Readable;
  headers: Record<string, string | number>;
};

const DEV_STREAM = (config.EZD_ENV === 'DEV');

export const ImageService = {
  getImage,
} as const;

async function getImage(opts: GetImageOpts): Promise<ImageStreamRes> {
  let imagePath: string;
  let imageStreamRes: ImageStreamRes;
  let sz: ImgSz;

  if(validateImgSz(opts.sz)) {
    sz = opts.sz;
  } else if((opts.width !== undefined) || (opts.height !== undefined)) {
    sz = imgSzFromDimensions({
      width: opts.width,
      height: opts.height,
    });
  } else {
    sz = DEFAULT_IMG_SZ;
  }
  imagePath = [ sz, opts.imagePath ].join(path.sep);
  if(DEV_STREAM) {
    imageStreamRes = await getDevStream(imagePath);
  } else {
    imageStreamRes = await getS3Stream(imagePath);
    // todo:xxx: implement aws
    // throw new Error('real impl');
  }
  return imageStreamRes;
}

async function getS3Stream(imagePath: string): Promise<ImageStreamRes> {
  let imageStreamRes: ImageStreamRes;
  let headers: Record<string, string | number>;
  let s3Client = AwsS3Client.getClient();
  let objKey = [
    JCD_IMG_V4_S3_PREFIX,
    imagePath,
  ].join(path.sep);
  console.log(objKey);
  let getObjCmd = new GetObjectCommand({
    Bucket: config.EZD_API_BUCKET_KEY,
    Key: objKey,
  });
  let getObjResp = await s3Client.send(getObjCmd);
  headers = {};
  if(getObjResp.ContentType !== undefined) {
    headers['content-type'] = getObjResp.ContentType;
  }
  if(getObjResp.ContentLength !== undefined) {
    headers['content-length'] = getObjResp.ContentLength;
  }
  if(getObjResp.Body === undefined) {
    throw new Error('s3 GetObject response without body');
  }
  imageStreamRes = {
    stream: getObjResp.Body as Readable,
    headers,
  };
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
