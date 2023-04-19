import {   defaultResponse} from '@libs/api-gateway';
import { v4 as uuidv4 } from 'uuid';
import  * as AWS from 'aws-sdk';
var dynamo = new AWS.DynamoDB.DocumentClient();
const tableName=  process.env.SAVE_GAME_TABLE;
module.exports.guardado = async (event: any) => {
  console.log("Lamda guardado Activado");

  console.log(event);
  let body = event.detail;
  console.log('body');
  console.log(body);
  
  let OutputGame = body.OutputGame;
  console.log(JSON.stringify(OutputGame));
  
  for (let i = 0; i < OutputGame.length; i++) {
    const element = OutputGame[i];

    const params = {
      TableName:tableName,
      Item: {
        bcId: uuidv4() ,
        ...element
      },        
    }
    console.log('params');
    console.log(params);
    try {
      console.log("Holaaaaaa");
      let response = await dynamo.put(params).promise();
      console.log('response');
      console.log(response);
      
    
    } catch (error) {
      console.log(error);
      return defaultResponse(500,error);
    }
  }
  
  console.log('finnnnnnnnnn');
    
    return defaultResponse(200,OutputGame);
  

};
