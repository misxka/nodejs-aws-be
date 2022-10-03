import { DynamoDB } from 'aws-sdk';

export const findProductById = async (id: string)=> {
  const isValid = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id);
  if (!isValid) return null;

  const dynamoDB = new DynamoDB.DocumentClient();
  return await dynamoDB.query({
    TableName: process.env.PRODUCTS_TABLE,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': id },
  }).promise();
};
