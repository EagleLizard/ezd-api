
import { Pool, PoolClient, QueryConfig, QueryResult } from 'pg';
import { config } from '../../config';
import { isPromise } from 'util/types';
import { SecretService } from '../../service/secret-service';

export type DbClient = {
  query<T extends any[], V extends any[]>(query: string | QueryConfig<T[]>, values?: V): Promise<QueryResult>;
};

const getPool = (function getGetPool() {
  let pgPool: Pool;
  return async function getPool() {
    if(pgPool !== undefined) {
      return pgPool;
    }
    let pgPassword: string | undefined;
    if(config.POSTGRES_PASSWORD !== undefined) {
      pgPassword = config.POSTGRES_PASSWORD;
    } else {
      pgPassword = await SecretService.getSsmParam('POSTGRES_PASSWORD');
    }
    if(pgPassword === undefined) {
      throw new Error('missing postgres password');
    }
    pgPool = new Pool({
      host: config.POSTGRES_HOST,
      port: config.POSTGRES_PORT,
      user: config.POSTGRES_USER,
      password: pgPassword,
      database: config.POSTGRES_DB,
    });
    return pgPool;
  };
})();

export class PgClient {
  private static async getClient() {
    let pool = await getPool();
    const client = await pool.connect();
    return client;
  }

  static async query<T extends any[], V extends any[]>(query: string | QueryConfig<T[]>, values?: V): Promise<QueryResult> {
    // let client = await PgClient.getClient();
    // let queryRes = await client.query(query, values);
    // client.release();
    let pool = await getPool();
    let queryRes = await pool.query(query, values);
    return queryRes;
  }

  static async transact<T>(cb: (client: PoolClient) => Promise<T> | T): Promise<T> {
    let txnClient: PoolClient;
    let cbResult: Promise<T> | T;
    txnClient = await PgClient.getClient();
    try {
      await txnClient.query('BEGIN');
      cbResult = cb(txnClient);
      if(isPromise(cbResult)) {
        await cbResult;
      }
      await txnClient.query('COMMIT');
      return cbResult;
    } catch(e) {
      await txnClient.query('ROLLBACK');
      throw e;
    } finally {
      txnClient.release();
    }
  }

  static async end() {
    let pool = await getPool();
    return pool.end();
  }

  static async checkTxn(client: DbClient) {
    /*
    see: https://dba.stackexchange.com/a/208375
    _*/
    let isTxn = !(await client.query('SELECT now() = statement_timestamp() as res')).rows[0]?.res;
    return isTxn;
  }
}
