import { APIGatewayProxyEvent } from 'aws-lambda';

import { getProductById } from '../../src/functions/products/getProductById';

describe('getProductById function', () => {
  const correctId = '7567ec4b-b10c-48c5-9345-fc73c48a80a0';
  const wrongId = 'mockId';

  const successfulMock = JSON.stringify({
    product: {
      count: 6,
      description: "Short Product Description - Car slot 2",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
      price: 25000,
      title: "Car slot 2"
    }
  });
  
  it('should return product', async () => {
    const eventMock = {
      pathParameters: {
        productId: correctId,
      },
    } as unknown as APIGatewayProxyEvent;

    const result = await getProductById(eventMock);
    expect(result.body).toEqual(successfulMock);
  });

  it('should return 404 error', async () => {
    const eventMock = {
      pathParameters: {
        productId: wrongId,
      },
    } as unknown as APIGatewayProxyEvent;

    const result = await getProductById(eventMock);
    const { statusCode } = result;
    expect(statusCode).toEqual(404);
  });
});
