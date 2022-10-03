import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import { getProductsList, getProductById, addProduct } from '@functions/products';
import { swagger } from '@functions/swagger';

dotenv.config()

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
      PRODUCTS_TABLE: process.env.PRODUCTS_TABLE,
      STOCKS_TABLE: process.env.STOCKS_TABLE,
    },
    stage: 'dev',
    region: 'eu-west-1',
    httpApi: {
      cors: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: "*",
      },
    ],
  },
  // import the function via paths
  functions: { getProductsList, getProductById, addProduct, swagger },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
