import fs from 'fs';
import { Request, Response, Router } from 'express';

import { MethodErrors } from '../output/errors';

export enum HTTPMethods {
  POST = 'post',
  GET = 'get',
  DELETE = 'delete',
  PATCH = 'patch',
}

interface IRoute {
  path: string;
  method: HTTPMethods;
  handler: (request: Request, response: Response) => void | Promise<void>;
}

export default abstract class Controller {
  public router: Router = Router();
  public abstract path: string;
  public abstract routes: Array<IRoute>;

  public setRoutes = (): Router => {
    for (const route of this.routes) {
      try {
        this.router[route.method](route.path, route.handler);
      } catch (err) {
        console.log(MethodErrors.notValid);
      }
    }

    return this.router;
  };

  protected success(
    response: Response,
    data: object,
    message?: string
  ): Response {
    return response.status(200).send({
      message: message || 'Success',
      data: data,
    });
  }

  protected successStream(
    response: Response,
    headers: any,
    video: fs.ReadStream
  ): Response {
    response.writeHead(206, headers);
    return video.pipe(response);
  }

  protected error(
    response: Response,
    message?: string,
    statusCode?: number
  ): Response {
    return response.status(statusCode!).send({
      message: message || 'Internal Server Error',
    });
  }
}
