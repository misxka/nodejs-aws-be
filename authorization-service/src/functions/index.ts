import { handlerPath } from '@libs/handler-resolver';

export const basicAuthorizer = {
  handler: `${handlerPath(__dirname)}/basicAuthorizer.basicAuthorizer`
};
