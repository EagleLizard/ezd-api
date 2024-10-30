
import { PgClient } from '../../lib/db/postgres-client';
import { JcdProjectImageDto } from '../../lib/models/dto/jcd-project-image-dto';

export class JcdImageDb {
  private constructor() {}
  static getProjectImages = getProjectImages;
}

async function getProjectImages(jcd_project_id: number) {
  let queryStr = `
    SELECT
      jpi.jcd_project_image_id, jpi.kind, jpi.active,
      ji.path,
      jpis.sort_order
    FROM jcd_project_image jpi
      INNER JOIN jcd_project_image_sort jpis
        ON jpi.jcd_project_image_id = jpis.jcd_project_image_id
      INNER JOIN jcd_image ji
        ON jpi.jcd_image_id = ji.jcd_image_id
    WHERE jpi.jcd_project_id = $1
    ORDER BY jpis.sort_order ASC
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  let jcdProjectImageDtos = res.rows.map(JcdProjectImageDto.parse);
  return jcdProjectImageDtos;
}
