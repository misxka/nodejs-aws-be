import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { Product } from '../../models/fe/product.model';
import { findAllProducts } from '../../utils/product/findAll';
import { serverError } from '../../utils/errors';
import { log } from '../../utils/logger';

export const getProductsList = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    log('getProductsList', event);

    const products: Product[] = await findAllProducts();
    return formatJSONResponse(200, {
      products,
    });
  } catch (e) {
    const { statusCode, message } = serverError;
    return formatJSONResponse(statusCode, {
      message
    });
  }
};

export const main = middyfy(getProductsList);
