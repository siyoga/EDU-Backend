import express from 'express';
import cors from 'cors';

import { Application, json, RequestHandler, urlencoded } from 'express';

import AuthController from './controller/AuthController';
import UserController from './controller/UserController';
import Controller from './typings/Controller';
import Server from './typings/Server';
import database from './db_models';
import CourseController from './controller/CourseController';

const app: Application = express();
const server: Server = new Server(app, database.sequelize, 8080);

const controllers: Array<Controller> = [
  new AuthController(),
  new UserController(),
  new CourseController(),
];
const middlewares: Array<RequestHandler> = [
  json(),
  urlencoded({ extended: false }),
  cors({ origin: true, credentials: true }),
];

Promise.resolve()
  .then(() => server.connectToDatabase())
  .then(() => {
    server.loadMiddlewares(middlewares);
    server.loadControllers(controllers);
    server.run();
  });
