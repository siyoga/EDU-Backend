import { Application, RequestHandler } from 'express';
import http from 'http';
import { Sequelize } from 'sequelize/types';
import Controller from './Controller';

export default class Server {
  private app: Application;
  private database: Sequelize;
  private readonly port: number;

  constructor(app: Application, database: Sequelize, port: number) {
    this.app = app;
    this.database = database;
    this.port = port;
  }

  public run(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`The server is running on port ${this.port}`);
    });
  }

  public loadMiddlewares(middlewares: Array<RequestHandler>) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  public loadControllers(controllers: Array<Controller>): void {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.setRoutes());
    });
  }

  public async connectToDatabase(): Promise<void> {
    try {
      await this.database.authenticate();
      await this.database.sync();
      console.log('Database is successfully started.');
    } catch (e) {
      console.log(e);
    }
  }
}
