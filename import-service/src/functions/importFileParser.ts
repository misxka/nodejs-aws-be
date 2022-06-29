import { APIGatewayProxyResult, S3Event } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parser';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

export const importFileParser = async (event: S3Event): Promise<APIGatewayProxyResult> => {
  for (const record of event.Records) {
    const { awsRegion, s3: { bucket, object: { key } } } = record;
    console.log('Key: ' + key);
    const s3 = new S3({ region: awsRegion });
    
    const sqs = new SQS();

    const promise = () => new Promise(() => {
      s3.getObject({
        Bucket: bucket.name,
        Key: key,
      }).createReadStream()
        .pipe(csv())
        .on('data', (chunk) => {
          console.log(chunk);

          sqs.sendMessage({
            QueueUrl: process.env.SQS_URL,
            MessageBody: JSON.stringify(chunk),
          }, (e, data) => {
            if (e) {
              console.error(`Data was not sent: ${e}`);
              return;
            }
            console.log(`Message ${data.MessageId} was sent.`);
          });
        })
        .on('end', async () => {
          console.log(`${key} successfully parsed.`)

          await s3.copyObject({
            Bucket: bucket.name,
            Key: key.replace('uploaded', 'parsed'),
            CopySource: `${bucket.name}/${key}`,
          }).promise();

          await s3.deleteObject({
            Bucket: bucket.name,
            Key: key,
          }).promise();

          console.log(`${key} was moved from uploaded to parsed.`);
        });
    });

    await promise();
  }

  return formatJSONResponse(200, {
    message: 'Successfully parsed and moved',
  });
};

export const main = middyfy(importFileParser);