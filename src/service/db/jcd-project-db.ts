
import { PgClient } from '../../lib/db/postgres-client';
import { JcdProjectDescDto, JcdProjectDescDtoType } from '../../lib/models/dto/jcd-project-desc-dto';
import { JcdProjectDto } from '../../lib/models/dto/jcd-project-dto';
import { JcdProjectListItemDto } from '../../lib/models/dto/jcd-project-list-item-dto';
import { JcdProjectVenueDto } from '../../lib/models/dto/jcd-project-venue-dto';
import { JcdProjectBaseDto } from '../../lib/models/dto/jcd-project-base-dto';

export const JcdProjectDb = {
  getProjectByKey,
  getProjects,
  getProjectBaseByRoute,
  getDesc,
  getVenue,
} as const;

async function getProjectByKey(project_key: string) {
  let queryStr = `
    SELECT
      jp.jcd_project_id, jp.project_key, jp.route, jp.title, jp.project_date
    FROM jcd_project jp
    WHERE jp.project_key LIKE $1
    LIMIT 1
  `;
  let res = await PgClient.query(queryStr, [
    project_key,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  return JcdProjectBaseDto.parse(res.rows[0]);
}

async function getProjects() {
  let queryStr = `
    SELECT 
      jp.jcd_project_id, jp.project_key, jp.route, jp.title, jp.project_date,
      jgi.path as title_uri,
      jps.sort_order
    FROM jcd_project jp
      INNER JOIN jcd_project_sort jps
        ON jp.jcd_project_id = jps.jcd_project_id
      LEFT JOIN (
        SELECT
          count(1), jg.gallery_key, ji.path
        FROM jcd_gallery jg
          INNER JOIN jcd_gallery_image jgi
            ON jg.jcd_gallery_id = jgi.jcd_gallery_id
          INNER JOIN jcd_image ji
            ON jgi.jcd_image_id = ji.jcd_image_id
        WHERE jgi.kind = 'title'
        GROUP BY jg.gallery_key, ji.path
      ) jgi on jp.project_key = jgi.gallery_key
    ORDER BY jps.sort_order ASC
  `;
  let res = await PgClient.query(queryStr);
  let jcdProjectListItems = res.rows.map(JcdProjectListItemDto.deserialize);
  return jcdProjectListItems;
}

async function getProjectBaseByRoute(projectRoute: string) {
  let queryStr = `
    SELECT
      jp.jcd_project_id, jp.project_key, jp.route, jp.title, jp.project_date,
      jpv."name" as venue,
      jpd.text as description_text
    FROM jcd_project jp
      LEFT JOIN (
        SELECT
          count(1), v."name", jpv.jcd_project_id
        FROM jcd_project_venue jpv
          INNER JOIN venue v
            ON jpv.venue_id = v.venue_id
        GROUP BY jpv.jcd_project_id, v."name"
      ) jpv ON jp.jcd_project_id = jpv.jcd_project_id
      LEFT JOIN (
        SELECT
          count(1), d.text, jpd.jcd_project_id
        FROM jcd_project_description jpd
          INNER JOIN description d
            ON jpd.description_id = d.description_id
        GROUP BY jpd.jcd_project_id, jpd.last_modified, d.text
        ORDER BY jpd.last_modified DESC
      ) jpd ON jp.jcd_project_id = jpd.jcd_project_id
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
