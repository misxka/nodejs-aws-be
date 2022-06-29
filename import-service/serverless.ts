import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import { importProductsFile, importFileParser, catalogBatchProcess } from './src/functions/index';
import { Config } from './src/utils/constants';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_URL: {
        Ref: 'catalogItemsQueue',
      },
      SNS_ARN: {
        Ref: 'createProductTopic',
      },
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
      EMAIL_ENDPOINT: process.env.EMAIL_ENDPOINT,
    },
    stage: 'dev',
    region: Config.Region,
    httpApi: {
      cors: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: [
          `arn:aws:s3:::${Config.Bucket}`,
        ],
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [
          `arn:aws:s3:::${Config.Bucket}/*`,
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          {
            'Fn::GetAtt': [
              'catalogItemsQueue',
              'Arn',
            ],
          },
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'createProductTopic',
        },
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
          Subscription: [
            {
              Endpoint: process.env.EMAIL_ENDPOINT,
              Protocol: 'email',
            },
          ],
        },
      }
    },
  },
};

module.exports = serverlessConfiguration;
