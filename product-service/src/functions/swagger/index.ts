import { handlerPath } from '@libs/handler-resolver';

export const swagger = {
  handler: `${handlerPath(__dirname)}/getSwagger.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/swagger',
      },
    },
  ],
};
