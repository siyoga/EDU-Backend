import { MethodErrors } from '../output/errors';
import { Request, Response, Router } from 'express';

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

  protected success(res: Response, data: object, message?: string): Response {
    return res.status(200).send({
      message: message || 'Success',
      data: data,
    });
  }

  protected error(
    res: Response,
    message?: string,
    statusCode?: number
  ): Response {
    return res.status(statusCode!).send({
      message: message || 'Internal Server Error',
    });
  }
}
