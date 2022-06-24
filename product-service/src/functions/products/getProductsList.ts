import { APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { Product } from '../../models/fe/product.model';
import { findAllProducts } from '../../utils/product';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  const products: Product[] = await findAllProducts();
  return formatJSONResponse(200, {
    products,
  });
};

export const main = middyfy(getProductsList);
