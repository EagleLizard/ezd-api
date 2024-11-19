
import { SSMClient } from '@aws-sdk/client-ssm';
import { type AwsCredentialIdentity } from '@smithy/types';

import { config } from '../../config';
import { AwsUtil } from './aws-util';

type GetAwsSsmClientOpts = {} & {
  region?: string;
};

const DEV_ENV = config.EZD_ENV === 'DEV';
const SSM_PREFIX = getSsmPrefix();

export const AwsSsmClient = {
  SSM_PREFIX,
  getClient,
} as const;

function getClient(opts?: GetAwsSsmClientOpts) {
  let credentials: AwsCredentialIdentity | undefined;
  let region = opts?.region ?? config.EZD_API_AWS_REGION;

  if(DEV_ENV) {
    credentials = {
      accessKeyId: AwsUtil.getAccessKeyId(),
      secretAccessKey: AwsUtil.getSecretAccessKey(),
    };
  }
  let ssmClient = new SSMClient({
    region,
    credentials,
  });
  return ssmClient;
}

function getSsmPrefix() {
  let ssmEnvPrefix: string;
  let ssmPrefix: string;
  if(DEV_ENV) {
    ssmEnvPrefix = 'dev';
  } else {
    ssmEnvPrefix = 'prod';
  }
  ssmPrefix = `/${ssmEnvPrefix}/ezd-api`;
  return ssmPrefix;
}
