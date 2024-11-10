
import { PgClient } from '../../lib/db/postgres-client';
import { JcdCreditDto } from '../../lib/models/dto/jcd-credit-dto';
import { JcdProdCreditDto } from '../../lib/models/dto/jcd-prod-credit-dto';

import { JcdProducerDto } from '../../lib/models/dto/jcd-producer-dto';

export const JcdCreditsDb = {
  getProducers,
  getCredits,
  getProdCredits,
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
  return res.rows.map(JcdProducerDto.decode);
}

async function getCredits(jcd_project_id: number) {
  let queryStr = `
    SELECT
      jc.jcd_credit_id, jc.label,
      jcc.jcd_credit_contrib_id,
      coalesce(p."name", o."name") name
    FROM jcd_credit jc
      LEFT JOIN jcd_credit_contrib jcc
        ON jc.jcd_credit_id = jcc.jcd_credit_id
      LEFT JOIN person p
        ON jcc.person_id = p.person_id
      LEFT JOIN org o
        ON jcc.org_id = o.org_id
    WHERE jc.jcd_project_id = $1
    ORDER BY jc.sort_order ASC, jcc.sort_order ASC
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  return res.rows.map(JcdCreditDto.decode);
}

async function getProdCredits(jcd_project_id: number) {
  let queryStr = `
    SELECT
      jpc.jcd_prod_credit_id, jpc.label,
      jpcc.jcd_prod_credit_contrib_id,
      coalesce(p."name", o."name") name
    FROM jcd_prod_credit jpc
      LEFT JOIN jcd_prod_credit_contrib jpcc
        ON jpcc.jcd_prod_credit_id = jpc.jcd_prod_credit_id
      LEFT JOIN person p
        ON jpcc.person_id = p.person_id
      LEFT JOIN org o
        ON jpcc.org_id = o.org_id
    WHERE jpc.jcd_project_id = $1
    ORDER BY jpc.sort_order ASC, jpcc.sort_order ASC
  `;
  let res = await PgClient.query(queryStr, [
    jcd_project_id,
  ]);
  return res.rows.map(JcdProdCreditDto.decode);
}
