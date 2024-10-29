
import { PgClient } from '../../lib/db/postgres-client';
import { JcdProjectDescDto, JcdProjectDescDtoType } from '../../lib/models/dto/jcd-project-desc-dto';
import { JcdProjectDto } from '../../lib/models/dto/jcd-project-dto';
import { JcdProjectListItemDto } from '../../lib/models/dto/jcd-project-list';
import { JcdProjectVenueDto } from '../../lib/models/dto/jcd-project-venue-dto';

export const JcdProjectDb = {
  getProjects,
  getProjectBase,
  getDesc,
  getVenue,
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
  let jcdProjectListItems = res.rows.map(JcdProjectListItemDto.deserialize);
  return jcdProjectListItems;
}

async function getProjectBase(projectRoute: string) {
  let queryStr = `
    SELECT
      jp.jcd_project_id, jp.project_key, jp.route, jp.title, jp.project_date,
      v."name" as venue
    FROM jcd_project jp
      INNER JOIN jcd_project_venue jpv
        ON jpv.jcd_project_id = jp.jcd_project_id
      INNER JOIN venue v
        ON jpv.venue_id = v.venue_id
    WHERE jp.route = $1
  `;
  let res = await PgClient.query(queryStr, [
    projectRoute,
  ]);
  let jcdProjectDto = JcdProjectDto.parse(res.rows[0]);
  return jcdProjectDto;
}

async function getDesc(jcd_project_id: number): Promise<JcdProjectDescDtoType> {
  let queryStr = `
    SELECT
      jpd.jcd_project_description_id, d.description_id, d.text
    FROM jcd_project_description jpd
      INNER JOIN description d
        ON jpd.description_id = d.description_id
    WHERE jpd.jcd_project_id = $1
    ORDER BY jpd.last_modified DESC
    LIMIT 1
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  let jcdProjectDescDto = JcdProjectDescDto.parse(res.rows[0]);
  return jcdProjectDescDto;
}

async function getVenue(jcd_project_id: number) {
  let queryStr = `
    SELECT jpv.jcd_project_venue_id, v."name" FROM jcd_project_venue jpv
      INNER JOIN venue v
        ON jpv.venue_id = v.venue_id
    WHERE jpv.jcd_project_id = $1
    ORDER BY jpv.last_modified DESC
    LIMIT 1
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  let jcdProjectVenueDto = JcdProjectVenueDto.parse(res.rows[0]);
  return jcdProjectVenueDto;
}
