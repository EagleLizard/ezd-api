
import path from 'path/posix';
import { JcdImageDb } from './db/jcd-image-db';
import { JcdGalleryImageDtoType } from '../lib/models/dto/jcd-gallery-image-dto';

type JcdProjectImageType = 'GALLERY' | 'TITLE';

type JcdProjectImage = {} & {
  id: string;
  projectKey: string;
  bucketFile: string;
  orderIdx: number;
  active: boolean;
  imageType: JcdProjectImageType;
};

export const JcdImageService = {
  getGalleryImagesByKey,
} as const;

async function getGalleryImagesByKey(opts: {
  galleryKey: string;
}): Promise<JcdProjectImage[]> {
  let jcdGalleryImages: JcdProjectImage[];
  let jcdGalleryImageDtos = await JcdImageDb.getGalleryImagesByKey(opts.galleryKey);
  jcdGalleryImages = [];
  for(let i = 0; i < jcdGalleryImageDtos.length; ++i) {
    let imageId: string;
    let jcdGalleryImage: JcdProjectImage;
    let jcdGalleryImageDto = jcdGalleryImageDtos[i];
    let parsedImagePath = path.parse(jcdGalleryImageDto.path);
    imageId = parsedImagePath.name;
    jcdGalleryImage = {
      id: imageId,
      projectKey: opts.galleryKey,
      bucketFile: jcdGalleryImageDto.path,
      orderIdx: jcdGalleryImageDto.sort_order,
      active: jcdGalleryImageDto.active,
      imageType: getImageTypeFromKind(jcdGalleryImageDto.kind),
    };
    jcdGalleryImages.push(jcdGalleryImage);
  }
  return jcdGalleryImages;
}

function getImageTypeFromKind(kind: JcdGalleryImageDtoType['kind']): JcdProjectImageType {
  switch(kind) {
    case 'title':
      return 'TITLE';
    case 'gallery':
      return 'GALLERY';
    default:
      throw new Error(`invalid JcdProjectImage kind: ${kind}`);
  }
}
