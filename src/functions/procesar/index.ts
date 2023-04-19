//import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.procesar`,
  /*Policies:{
    Statement: [
      {
        Effect: "Allow",
        Action: ['events:PutEvents'],
        Resource: "*"
      }
    ]
  },*/
  events: [
    {
      sqs: {
        arn: {
          'Fn::GetAtt': ['PendingProcessQueue','Arn']          
        },
        batchSize: 1
      },
     }

  ],
};
