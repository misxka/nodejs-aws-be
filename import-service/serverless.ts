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
      PRODUCTS_TABLE: process.env.PRODUCTS_TABLE,
      STOCKS_TABLE: process.env.STOCKS_TABLE,
      EMAIL_ENDPOINT: process.env.EMAIL_ENDPOINT,
      ACCOUNT_ID: process.env.ACCOUNT_ID,
    },
    stage: 'dev',
    region: Config.Region,
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
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
