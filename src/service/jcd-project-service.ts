
import { PgClient } from '../lib/db/postgres-client';
import { JcdProjectListItemDto } from '../lib/models/dto/jcd-project-list';

export const JcdProjectService = {
  getProjects,
} as const;

async function getProjects() {
  let queryStr = `
    SELECT 
      jp.project_key as "projectKey", 
      jp.route, jp.title, 
      ji.path as "titleUri",
      jps.sort_order as "orderIndex"
    FROM jcd_project jp
      INNER JOIN jcd_project_sort jps
        ON jp.jcd_project_id = jps.jcd_project_id
      INNER JOIN jcd_project_image jpi
        ON jp.jcd_project_id = jpi.jcd_project_id
      INNER JOIN jcd_image ji
        ON jpi.jcd_image_id = ji.jcd_image_id
    WHERE jpi.kind = 'title'
    ORDER BY jps.sort_order ASC
  `;
  let res = await PgClient.query(queryStr);
  console.log(res.rows);
  let jcdProjectListItems = res.rows.map(JcdProjectListItemDto.deserialize);
  return jcdProjectListItems;
}
