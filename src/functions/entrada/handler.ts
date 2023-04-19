import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {   defaultResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import  * as AWS from 'aws-sdk';

import schema from './schema';

var sqs = new AWS.SQS({region: process.env.SQS_REGION});
const QUEUE_URL = process.env.PENDING_PROCESS_QUEUE;

const entrada: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event.body.game);
  let game = event.body.game.map(e =>{
    e.plays = e.plays.toUpperCase();
    return e;
  });
  const params = {
    MessageBody: JSON.stringify({game}),
    QueueUrl: QUEUE_URL
  };
  try {
    const response = await sqs.sendMessage(params).promise();
    return defaultResponse(200,{
      message: {
        body: event.body,
        MessageSQS: response
      }
    });

  } catch (error) {
    return defaultResponse(500,{
      message: error
    });
  }
};

export const main = middyfy(entrada);
