import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent, Callback } from 'aws-lambda';

enum Actions {
  Allow = 'Allow',
  Deny = 'Deny',
};

export const basicAuthorizer = (event: APIGatewayTokenAuthorizerEvent, context, cb: Callback<APIGatewayAuthorizerResult>) => {
  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
  }
  
  try {
    const { authorizationToken, methodArn } = event;
    
    const payload = authorizationToken.split(' ')[1];
    const buffer = Buffer.from(payload, 'base64');
    
    const credentials = buffer.toString('utf-8').split(':');
    const username = credentials[0];
    const password = credentials[1];
    
    const secret = process.env[username];
    const effect = (!secret || secret != password) ? Actions.Deny : Actions.Allow;

    const policy = generatePolicy(username, effect, '*');

    cb(null, policy);
  } catch (err) {
    cb('Unauthorized');
  }
};

const generatePolicy = (principalId, effect, resource): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
