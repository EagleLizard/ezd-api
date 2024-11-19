
import assert from 'assert';

import { GetParametersByPathCommand, type Parameter } from '@aws-sdk/client-ssm';

import { AwsSsmClient } from './aws-ssm-client';
import { config } from '../../config';
import { isString } from '../../util/validate-primitives';

let paramMap: Map<string, Parameter> | undefined;

export const AwsUtil = {
  getAccessKeyId,
  getSecretAccessKey,
  getSsmParams,
} as const;

function getAccessKeyId(): string {
  let accessKeyId = config.EZD_AWS_ACCESS_KEY_ID;
  if(accessKeyId === undefined) {
    throw new Error('missing access key id');
  }
  return accessKeyId;
}

function getSecretAccessKey(): string {
  let secretAccessKey = config.EZD_AWS_SECRET_ACCESS_KEY;
  if(secretAccessKey === undefined) {
    throw new Error('missing secret access key');
  }
  return secretAccessKey;
}

async function getSsmParams(): Promise<Map<string, Parameter>> {
  if(paramMap !== undefined) {
    return paramMap;
  }
  console.log('fetching SSM parameters');
  paramMap = new Map();
  let ssmClient = AwsSsmClient.getClient();
  let resp = await ssmClient.send(
    new GetParametersByPathCommand({
      Path: `${AwsSsmClient.SSM_PREFIX}/`,
      WithDecryption: true,
    }),
  );
  let parameters = resp.Parameters ?? [];
  let ssmPrefix = `${AwsSsmClient.SSM_PREFIX}/`; // include trailing '/'
  for(let i = 0; i < parameters.length; ++i) {
    let currParam = parameters[i];
    assert((
      isString(currParam.Name)
      && currParam.Name.startsWith(ssmPrefix)
    ), currParam.Name);
    let currParamKey = currParam.Name.slice(ssmPrefix.length);
    paramMap.set(currParamKey, currParam);
  }
  return paramMap;
}
