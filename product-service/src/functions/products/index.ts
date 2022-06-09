import { handlerPath } from '@libs/handler-resolver';

export const getProductsList = {
  handler: `${handlerPath(__dirname)}/getProductsList.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products',
      },
    },
  ],
};

export const getProductById = {
  handler: `${handlerPath(__dirname)}/getProductsById.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products/{productId}',
      },
    },
  ],
};
