import  * as AWS from 'aws-sdk';
import {   defaultResponse} from '@libs/api-gateway';
var eventbridge = new AWS.EventBridge();
module.exports.procesar = async (event: any) => {
  console.log("Lamda procesar Activado");

  console.log(event);
  let body = JSON.parse(event.Records[0].body);
  let games = body.game;
  let OutputGame = [];
  if (games.length > 0) {
    games.forEach((element) => {
      //let numero_jugadores = element.players;
      let Array_jugadores = [];
      const numero_fichas = 3;
      for (let f = 0; f < element.players; f++) {
        let num = f + 1;
        let name = 'juagador '+ num;
        Array_jugadores.push({ nombre: name, fichas: numero_fichas });
      }
      if (Array_jugadores.length >= 3) {
        let fichas_Centro = 0;
        let jugadas = element.plays;
        let ganador_existe = false;
        while (!ganador_existe) {
          for (let i = 0; i < Array_jugadores.length&&!ganador_existe; i++) {
            if (Array_jugadores[i].fichas > 0) {
              let cantidad_dados: any;
              if (Array_jugadores[i].fichas == 1) {
                cantidad_dados = 1;
              } else if (Array_jugadores[i].fichas == 2) {
                cantidad_dados = 2;
              } else {
                cantidad_dados = 3;
              }
              if (jugadas.length >= cantidad_dados) {
                let dados = jugadas.substr(0, cantidad_dados);
                dados.split("").forEach((e: any) => {                                    
                  if (e == "L") {
                    Array_jugadores[i].fichas--;
                    if (i == 0) {
                      Array_jugadores[Array_jugadores.length - 1].fichas++;
                    } else {
                      Array_jugadores[i - 1].fichas++;
                    }
                  } else if (e == "C") {
                    Array_jugadores[i].fichas--;
                    fichas_Centro++;
                  } else if (e == "R") {
                    Array_jugadores[i].fichas--;
                    if (i == Array_jugadores.length - 1) {
                      Array_jugadores[0].fichas++;
                    } else {
                      Array_jugadores[i + 1].fichas++;
                    }
                  }
                });
                jugadas = jugadas.slice(cantidad_dados);
                //verificar si gano alguien
                let jugadoresConFichas = Array_jugadores.filter(
                  (jugador) => jugador.fichas > 0
                );
                if (jugadoresConFichas.length == 1) {
                  ganador_existe = true;
                  let dataGame = {
                    jugadores: Array_jugadores,
                    codigo: "W",
                    jugador: jugadoresConFichas[0],
                    centro: fichas_Centro,
                  };
                  OutputGame.push(dataGame);
                }
              } else {
                ganador_existe = true;
                let dataGame = {
                  jugadores: Array_jugadores,
                  codigo: "*",
                  jugador: Array_jugadores[i],
                  centro: fichas_Centro,
                };
                OutputGame.push(dataGame);
              }
            }
          }
        }
      } else {
        let dataGame = {
          jugadores: Array_jugadores,
          codigo: "*",
          jugador: null,
          centro: 0,
          mensaje: "El numero de jugadores es menor de 3",
        };
        OutputGame.push(dataGame);
      }
    });
  }

  var params = {
    Entries:[
      {
        Detail: JSON.stringify({OutputGame}),
        DetailType: 'info',
        Source: 'guardado.info'
      },
    ]
  };

  console.log(params);
  try {
    let response = await eventbridge.putEvents(params).promise();
    return defaultResponse(200,{
      message: params,
      response
    });
  } catch (error) {
    return defaultResponse(500,{
      message: error
    });
  }
};
