//import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.guardado`,
  events: [
    {
      sqs: {
        arn: {
          'Fn::GetAtt': ['PendingSaveQueue','Arn']          
        },
        batchSize: 1
      },
     }

  ],
  
};
