import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { Product } from '../../models/product.model';
import { findAllProducts } from '../../utils/product';

const getProductsList: APIGatewayProxyHandler = async () => {
  const products: Product[] = await findAllProducts();
  return formatJSONResponse(200, {
    products,
  });
};

export const main = middyfy(getProductsList);
