
import { PgClient } from '../../lib/db/postgres-client';
import { JcdCreditContribDto } from '../../lib/models/dto/jcd-credit-contrib-dto';
import { JcdCreditDto } from '../../lib/models/dto/jcd-credit-dto';
import { JcdProdCreditContribDto } from '../../lib/models/dto/jcd-prod-credit-contrib-dto';
import { JcdProdCreditDto } from '../../lib/models/dto/jcd-prod-credit-dto';

import { JcdProducerDto } from '../../lib/models/dto/jcd-producer-dto';

export const JcdCreditsDb = {
  getProducers,
  getCredits,
  getCreditContribs,
  getProdCredits,
  getProdCreditContribs,
} as const;

async function getProducers(jcd_project_id: number) {
  let queryStr = `
    SELECT jpr.jcd_producer_id, coalesce(p."name", o."name") name
    FROM jcd_producer jpr
      LEFT JOIN person p
        on jpr.person_id = p.person_id
      LEFT JOIN org o
        on jpr.org_id = o.org_id
    WHERE jpr.jcd_project_id = $1
    ORDER BY jpr.sort_order
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  let jcdProducerDtos = res.rows.map(JcdProducerDto.parse);
  return jcdProducerDtos;
}

async function getCredits(jcd_project_id: number) {
  let queryStr = `
    SELECT jc.jcd_credit_id, jc.label
    FROM jcd_credit jc
      INNER JOIN jcd_credit_sort jcs
        ON jc.jcd_credit_id = jcs.jcd_credit_id
    WHERE jc.jcd_project_id = $1
    GROUP BY jc.jcd_credit_id, jc.label, jcs.sort_order
    ORDER BY jcs.sort_order ASC
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  let jcdCreditDtos = res.rows.map(JcdCreditDto.parse);
  return jcdCreditDtos;
}

async function getCreditContribs(jcd_credit_id: number) {
  let queryStr = `
    SELECT
      jcc.jcd_credit_contrib_id,
      coalesce(p."name", o."name") name
    FROM jcd_credit_contrib jcc
      LEFT JOIN person p
        ON jcc.person_id = p.person_id
      LEFT JOIN org o
        ON jcc.org_id = o.org_id
    WHERE jcc.jcd_credit_id = $1
    ORDER BY jcc.sort_order ASC
  `;
  let res = await PgClient.query(queryStr, [
    jcd_credit_id,
  ]);
  let jcdCreditContribDtos = res.rows.map(JcdCreditContribDto.parse);
  return jcdCreditContribDtos;
}

async function getProdCredits(jcd_project_id: number) {
  let queryStr = `
    SELECT
      jpc.jcd_prod_credit_id, jpc.label
    FROM jcd_prod_credit jpc
      INNER JOIN jcd_prod_credit_sort jpcs
        ON jpc.jcd_prod_credit_id = jpcs.jcd_prod_credit_id
    WHERE jpc.jcd_project_id = $1
    GROUP BY jpc.jcd_prod_credit_id, jpc.label, jpcs.sort_order
    ORDER BY jpcs.sort_order ASC
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  let jcdProdCreditDtos = res.rows.map(JcdProdCreditDto.parse);
  return jcdProdCreditDtos;
}

async function getProdCreditContribs(jcd_project_id: number) {
  let queryStr = `
    SELECT
      jpcc.jcd_prod_credit_contrib_id,
      coalesce(p."name", o."name") name
    FROM jcd_prod_credit_contrib jpcc
      LEFT JOIN person p
        ON jpcc.person_id = p.person_id
      LEFT JOIN org o
        ON jpcc.org_id = o.org_id
    WHERE jpcc.jcd_prod_credit_id = $1
    ORDER BY jpcc.sort_order ASC
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  let jcdProdCreditContribDtos = res.rows.map(JcdProdCreditContribDto.parse);
  return jcdProdCreditContribDtos;
}
