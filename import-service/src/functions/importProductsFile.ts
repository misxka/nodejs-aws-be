import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Config, S3Operations } from '../utils/constants';

export const importProductsFile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { name } = event.queryStringParameters;
  const key = `uploaded/${name}`;

  const s3 = new S3({ region: 'eu-west-1' });
  const params = {
    Bucket: Config.Bucket,
    Key: key,
    Expires: 600,
    ContentType: 'text/csv',
  };

  const signedUrl = s3.getSignedUrl(S3Operations.PutObject, params);
  
  return formatJSONResponse(200, { signedUrl });
};

export const main = middyfy(importProductsFile);
