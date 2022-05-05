import multer from 'multer';

import { Request } from 'express';
import Controller, { HTTPMethods } from "../typings/Controller";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

export default class VideoController extends Controller {
  path = '/video';
  routes = [
    {
      path: '/upload',
      method: HTTPMethods.POST,
      handler: 
    }
  ];

  private storage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
      callback(null, 'public/videos');
    },
  
    filename: (request: Request, file: Express.Multer.File, callback: FilenameCallback): void => {
      callback(null, file.originalname);
    }
  })

  constructor() {
    super();
  }

  
} 