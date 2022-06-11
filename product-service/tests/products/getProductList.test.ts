import { getProductsList } from '../../src/functions/products/getProductsList';

describe('getProductsList function', () => {
  it('should return response with statusCode 200', async () => {
    const result = await getProductsList();
    const { statusCode } = result;
    expect(statusCode).toEqual(200);
  });
});
