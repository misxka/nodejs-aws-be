import { handlerPath } from '@libs/handler-resolver';
import { Config, S3Events } from '../utils/constants';

export const importProductsFile = {
  handler: `${handlerPath(__dirname)}/importProductsFile.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/import',
      },
    },
  ],
};

export const importFileParser = {
  handler: `${handlerPath(__dirname)}/importFileParser.main`,
  events: [
    {
      s3: {
        bucket: Config.Bucket,
        event: S3Events.ObjectCreated,
        existing: true,
        rules: [
          {
            prefix: 'uploaded/',
          },
        ],
      },
    },
  ],
};

export const catalogBatchProcess = {
  handler: `${handlerPath(__dirname)}/catalogBatchProcess.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          'Fn::GetAtt': [
            'catalogItemsQueue',
            'Arn',
          ],
        },
      },
    },
  ],
};
