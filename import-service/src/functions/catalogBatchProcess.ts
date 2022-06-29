import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';

import { middyfy } from '@libs/lambda';
import { insertProduct } from 'src/utils/product/insert';

export const catalogBatchProcess = async (event: SQSEvent) => {
  const sns = new SNS();

  const products = event.Records.map((record) => {
    const { body } = record;
    return JSON.parse(body);
  });

  const createdProducts = await Promise.all(products.map((product) => insertProduct(product)));

  console.log(`${createdProducts} were added to products table.`);
};

export const main = middyfy(catalogBatchProcess);