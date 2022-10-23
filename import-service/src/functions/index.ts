import * as dotenv from 'dotenv';

import { handlerPath } from '@libs/handler-resolver';
import { Config, S3Events } from '../utils/constants';

dotenv.config();

export const importProductsFile = {
  handler: `${handlerPath(__dirname)}/importProductsFile.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        cors: true,
        authorizer: {
          name: 'basicAuthorizer',
          arn: `arn:aws:lambda:${Config.Region}:${process.env.ACCOUNT_ID}:function:authorization-service-dev-basicAuthorizer`,
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
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
