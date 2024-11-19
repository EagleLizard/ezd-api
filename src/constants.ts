
import path from 'path';

export const BASE_DIR = path.resolve(__dirname, '..');

const LOG_DIR_NAME = 'logs';
const LOG_DIR_PATH = [
  BASE_DIR,
  LOG_DIR_NAME,
].join(path.sep);

const JCD_IMG_V4_S3_PREFIX = 'jcd-img-v4';

export {
  LOG_DIR_PATH,
  JCD_IMG_V4_S3_PREFIX,
};
