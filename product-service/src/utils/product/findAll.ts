import { DynamoDB } from 'aws-sdk';

export const findAllProducts = async () => {
  const dynamoDB = new DynamoDB.DocumentClient();
  return (await dynamoDB.scan({ TableName: process.env.PRODUCTS_TABLE }).promise()).Items;
};
