import type { AWS } from "@serverless/typescript";

import entrada from "@functions/entrada";
import procesar from "@functions/procesar";
import guardado from "@functions/guardado";
import notificacion from "@functions/notificacion";

const serverlessConfiguration: AWS = {
  service: "retoLCRGame",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      REGION: "${self:provider.region}",
      SAVE_GAME_TABLE:"SaveGameTable",
      PENDING_SAVE_QUEUE: {
        Ref: "PendingSaveQueue",
      },
      PENDING_SAVE_QUEUE_NAME: "PendingSaveQueue",
      PENDING_PROCESS_QUEUE: {
        Ref: "PendingProcessQueue",
      },
      PENDING_PROCESS_QUEUE_NAME: "PendingProcessQueue",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource:
          "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.SAVE_GAME_TABLE}",
      },
      {
        Effect: "Allow",
        Action: ["sqs:SendMessage"],
        Resource:
          "arn:aws:sqs:${self:provider.region}:*:${self:provider.environment.PENDING_PROCESS_QUEUE_NAME}",
      },{
        Effect: "Allow",
        Action: ["sqs:SendMessage"],
        Resource:
          "arn:aws:sqs:${self:provider.region}:*:${self:provider.environment.PENDING_SAVE_QUEUE_NAME}",
      },
    ],
  },
  // import the function via paths
  functions: { entrada, procesar, guardado, notificacion },
  resources: {
    Resources: {
      PendingProcessQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "${self:provider.environment.PENDING_PROCESS_QUEUE_NAME}",
        },
      },
      PendingSaveQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "${self:provider.environment.PENDING_SAVE_QUEUE_NAME}",
        },
      },
      SaveGameTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: '${self:provider.environment.SAVE_GAME_TABLE}',
          AttributeDefinitions: [
            {
              AttributeName: 'bcId',
              AttributeType: 'S',
            }
          ],
          KeySchema: [
            {
              AttributeName: 'bcId',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },  
          StreamSpecification: {
            StreamViewType: 'NEW_IMAGE'
          }        
        },  
      }
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
