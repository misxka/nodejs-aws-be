import { main as getSwagger } from '../../src/functions/swagger/getSwagger';

describe('getSwagger function', () => {
  it('should return correct response wit statusCode 200', async () => {
    const result = await getSwagger();
    const { statusCode } = result;
    expect(statusCode).toEqual(200);
  });
});
