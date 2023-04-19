import {   defaultResponse} from '@libs/api-gateway';
module.exports.notificacion = async (event: any) => {
  console.log("Lamda notificacion Activado");
  console.log(JSON.stringify(event));  
    
  return defaultResponse(200,event);
};
