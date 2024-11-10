
import { PgClient } from '../../lib/db/postgres-client';
import { JcdGalleryImageDto } from '../../lib/models/dto/jcd-gallery-image-dto';

export class JcdImageDb {
  private constructor() {}
  static getGalleryImagesByKey = getGalleryImages;
}

async function getGalleryImages(galleryKey: string) {
  let queryStr = `
    SELECT
      jgi.jcd_gallery_image_id, jgi.kind, jgi.sort_order, jgi.active,
      ji.path
    FROM jcd_gallery jg
      INNER JOIN jcd_gallery_image jgi
        ON jg.jcd_gallery_id = jgi.jcd_gallery_id
      INNER JOIN jcd_image ji
        ON jgi.jcd_image_id = ji.jcd_image_id
    WHERE jg.gallery_key = $1
    ORDER BY jgi.sort_order ASC
  `;
  let res = await PgClient.query(queryStr, [
    galleryKey,
  ]);
  let JcdGalleryImageDtos = res.rows.map(JcdGalleryImageDto.decode);
  return JcdGalleryImageDtos;
}
