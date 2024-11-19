
import { S3Client } from '@aws-sdk/client-s3';
import { type AwsCredentialIdentity } from '@smithy/types';
import { config } from '../../config';
import { AwsUtil } from './aws-util';

type GetAwsS3ClientOpts = {} & {
  region?: string;
};

const DEV_ENV = config.EZD_ENV === 'DEV';

export const AwsS3Client = {
  getClient,
} as const;

function getClient(opts?: GetAwsS3ClientOpts) {
  let credentials: AwsCredentialIdentity | undefined;
  let region = opts?.region ?? config.EZD_API_AWS_REGION;

  if(DEV_ENV) {
    // let accessKeyId = config.EZD_AWS_ACCESS_KEY_ID;
    // let secretAccessKey = config.EZD_AWS_SECRET_ACCESS_KEY;
    // if(accessKeyId === undefined) {
    //   throw new Error('missing access key id');
    // }
    // if(secretAccessKey === undefined) {
    //   throw new Error('missing secret access key');
    // }
    credentials = {
      accessKeyId: AwsUtil.getAccessKeyId(),
      secretAccessKey: AwsUtil.getSecretAccessKey(),
    };
  }

  let s3Cllient = new S3Client({
    region,
    // logger: awsSdkLogger,
    credentials,
  });
  return s3Cllient;
}
