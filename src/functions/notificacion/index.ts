//import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.notificacion`,
  events: [
    {
      stream: {
        type: 'dynamodb',
        batchSize: 1,
        startingPosition: 'LATEST',
        arn:{
          'Fn::GetAtt': ['SaveGameTable','StreamArn']
        }
      },
     }

  ],
  
};
