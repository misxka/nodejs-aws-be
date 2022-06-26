import { handlerPath } from '@libs/handler-resolver';

export const importProductsFile = {
  handler: `${handlerPath(__dirname)}/importProductsFile.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/import',
      },
    },
  ],
};