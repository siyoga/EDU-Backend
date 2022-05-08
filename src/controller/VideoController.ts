import { Request, Response } from 'express';

import Controller, { HTTPMethods } from '../typings/Controller';
import VideoService from '../services/VideoService';
import { FilesNotProvided } from '../output/errors';
import fileUpload from 'express-fileupload';

export default class VideoController extends Controller {
  path = '/video';
  routes = [
    {
      path: '/upload',
      method: HTTPMethods.POST,
      handler: this.handleUpload,
    },
  ];

  constructor() {
    super();
  }

  async handleUpload(request: Request, response: Response): Promise<void> {
    const video = request.files?.video as fileUpload.UploadedFile | undefined;
    const courseId = request.body.courseId;

    const videoService = new VideoService(video);
    const data = await videoService.upload(courseId);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data, data.message);
  }
}
