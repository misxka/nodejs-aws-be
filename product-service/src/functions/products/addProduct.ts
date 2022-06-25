import { APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { Product } from '../../models/fe/product.model';
import { insertProduct } from '../../utils/product/insert';
import { clientError, serverError } from '../../utils/errors';
import { log } from '../../utils/logger';

export const addProduct = async (event: { body: Omit<Product, 'id'> }): Promise<APIGatewayProxyResult> => {
  try {
    log('addProduct', event);
    
    const product: Product = await insertProduct(event.body);
    if (!product) {
      const { statusCode, message } = clientError;
      return formatJSONResponse(statusCode, {
        message
      });
    }
    return formatJSONResponse(201, {
      product,
    });
  } catch (e) {
    const { statusCode, message } = serverError;
    return formatJSONResponse(statusCode, {
      message
    });
  }
};

export const main = middyfy(addProduct);
