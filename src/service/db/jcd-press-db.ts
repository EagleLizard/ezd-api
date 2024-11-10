
import { PgClient } from '../../lib/db/postgres-client';
import { JcdPressDto } from '../../lib/models/dto/jcd-press-dto';

export const JcdPressDb = {
  getProjectPress,
} as const;

async function getProjectPress(jcd_project_id: number) {
  let queryStr = `
    SELECT
      jprs.jcd_press_id, jprs.description, jprs.link_text, jprs.link_url,
      pb."name" as publication_name
    FROM jcd_press jprs
      INNER JOIN publication pb
        ON jprs.publication_id = pb.publication_id
    WHERE jprs.jcd_project_id = $1
    ORDER BY jprs.sort_order ASC
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  return res.rows.map(JcdPressDto.decode);
}
