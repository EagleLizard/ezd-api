
import { isString } from '../../util/validate-primitives';

const ImgSzs = [
  'sm',
  'md',
  'lg',
  'xl',
] as const;
export type ImgSz = typeof ImgSzs[number];
export const DEFAULT_IMG_SZ: ImgSz = 'lg';

export function validateImgSz(val: unknown): val is ImgSz {
  if(!isString(val)) {
    return false;
  }
  return ImgSzs.includes(val as ImgSz);
}
