import 'reflect-metadata';
import * as bodyparser from 'body-parser';
import * as express from 'express';
import * as swagger from 'swagger-express-ts';
import path from 'path';
import cors from 'cors';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import authorizationMiddleware from './middleware/authorization';
import errorMiddleware from './middleware/error';
import logger from 'npmlog';
import { bindControllers } from './controller';
import { bindServices } from './services';
import { dashboardDataSource } from './data_sources/dashboard';
import './api_models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../.env') });

dashboardDataSource.initialize()
.then(() => {
  logger.info('Dashboard Data Source initialization successful!');
  require('./dashboard_migration');
})
.catch((err) => {
  logger.error(`Dashboard Data Source initialization failed: ${err}`, err);
  process.exit(1);
});

const corsOrigins = process.env.CORS_ALLOW_ORIGIN ? process.env.CORS_ALLOW_ORIGIN.split(';') : ['http://localhost'];

const container = new Container();

bindControllers(container);
bindServices(container);

const server = new InversifyExpressServer(container);
server.setConfig((app: any) => {
  app.use(bodyparser.json());
  app.use(cors({
    origin: corsOrigins,
  }));
  app.use(authorizationMiddleware);
  app.use('/api-docs/swagger', express.static('swagger'));
  app.use('/api-docs/swagger/assets', express.static('swagger/assets'));
  
  app.get('/ping', (req: express.Request, res: express.Response) => {
    res.send('pong 1');
  });
  app.use(swagger.express({
    definition: {
      info: {
        title: 'Dashboard API' ,
        version: '1.0.0'
      },
    }
  }));
});
server.setErrorConfig((app: any) => {
  app.use(errorMiddleware);
});

const app = server.build();
const port = process.env.SERVER_PORT || 31200;
app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});

process.on('uncaughtException', err => {
  logger.info(err.message);
});