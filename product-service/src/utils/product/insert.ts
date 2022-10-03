import { randomUUID } from 'crypto';
import { DynamoDB } from 'aws-sdk';

import { Product as ProductFE } from '../../models/fe/product.model';

export const insertProduct = async (product: Omit<ProductFE, 'id'>) => {
  const { title, description, price, count } = product;
  if (!title || !description || !price || !count) {
    return null;
  }

  const id = randomUUID();
  const dynamoDB = new DynamoDB.DocumentClient();
  const result = await dynamoDB.transactWrite({
    TransactItems: [
      {
        Put: {
          Item: {
            id,
            title,
            description,
            price,
          },
          TableName: process.env.PRODUCTS_TABLE,
        },
      },
      {
        Put: {
          Item: {
            product_id: id,
            count,
          },
          TableName: process.env.STOCKS_TABLE,
        },
      },
    ],
  }).promise();

  return result;
};
