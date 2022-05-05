import multer from 'multer';

import { MethodErrors } from '../output/errors';
import { Request, Response, Router } from 'express';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

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

  private storage = multer.diskStorage({
    destination: (
      request: Request,
      file: Express.Multer.File,
      callback: DestinationCallback
    ): void => {
      callback(null, 'public/videos');
    },

    filename: (
      request: Request,
      file: Express.Multer.File,
      callback: FilenameCallback
    ): void => {
      callback(null, file.originalname);
    },
  });

  private upload = multer({ storage: this.storage });

  public setRoutes = (): Router => {
    for (const route of this.routes) {
      try {
        if (route.path === '/upload') {
          this.router[route.method](
            route.path,
            this.upload.single('video'),
            route.handler
          );
        }

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
