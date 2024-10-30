
import path from 'path/posix';
import { JcdImageDb } from './db/jcd-image-db';
import { JcdProjectImageDtoType } from '../lib/models/dto/jcd-project-image-dto';

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
  getProjectImages,
} as const;

async function getProjectImages(opts: {
  jcd_project_id: number;
  jcd_project_key: string;
}): Promise<JcdProjectImage[]> {
  let jcdProjectImages: JcdProjectImage[];
  let jcdProjectImageDtos = await JcdImageDb.getProjectImages(opts.jcd_project_id);
  jcdProjectImages = [];
  for(let i = 0; i < jcdProjectImageDtos.length; ++i) {
    let imageId: string;
    let jcdProjectImage: JcdProjectImage;
    let jcdProjectImageDto = jcdProjectImageDtos[i];
    let parsedImagePath = path.parse(jcdProjectImageDto.path);
    imageId = parsedImagePath.name;
    jcdProjectImage = {
      id: imageId,
      projectKey: opts.jcd_project_key,
      bucketFile: jcdProjectImageDto.path,
      orderIdx: jcdProjectImageDto.sort_order,
      active: jcdProjectImageDto.active,
      imageType: getImageTypeFromKind(jcdProjectImageDto.kind),
    };
    jcdProjectImages.push(jcdProjectImage);
  }
  return jcdProjectImages;
}

function getImageTypeFromKind(kind: JcdProjectImageDtoType['kind']): JcdProjectImageType {
  switch(kind) {
    case 'title':
      return 'TITLE';
    case 'gallery':
      return 'GALLERY';
    default:
      throw new Error(`invalid JcdProjectImage kind: ${kind}`);
  }
}
