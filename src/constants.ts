
import path from 'path';

export const BASE_DIR = path.resolve(__dirname, '..');

const LOG_DIR_NAME = 'logs';
const LOG_DIR_PATH = [
  BASE_DIR,
  LOG_DIR_NAME,
].join(path.sep);

export {
  LOG_DIR_PATH
};
