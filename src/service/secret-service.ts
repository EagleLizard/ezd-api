import { AwsUtil } from '../lib/aws/aws-util';

export const SecretService = {
  getSsmParam,
} as const;

async function getSsmParam(paramKey: string) {
  let paramMap = await AwsUtil.getSsmParams();
  return paramMap.get(paramKey)?.Value;
}
