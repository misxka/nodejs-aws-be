import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import products from '../../mocks/products.json';

const getProductsList: APIGatewayProxyHandler = async (
  event
) => {
  return formatJSONResponse({
    products,
    event,
  });
};

export const main = middyfy(getProductsList);