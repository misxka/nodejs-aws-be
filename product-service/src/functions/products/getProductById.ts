import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { Product } from '../../models/product.model';
import products from '../../mocks/products.json';

const getProductById: APIGatewayProxyHandler = async (event) => {
  const product: Product = products.find(product => product.id === event.pathParameters.productId);
  if (!product) {
    return formatJSONResponse(404, {
      message: 'Product not found.'
    });
  }
  return formatJSONResponse(200, {
    product,
  });
};

export const main = middyfy(getProductById);