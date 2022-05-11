import fileUpload from 'express-fileupload';
import fs from 'fs';
import { Request, Response } from 'express';

import { HTTPMethods } from '../typings/Controller';
import Controller from '../typings/Controller';
import VideoService from '../services/VideoService';

import {
  FilesNotProvided,
  RangeHeadersRequire,
  RequireFieldNotProvided,
} from '../output/errors';

export default class VideoController extends Controller {
  path = '/video';
  routes = [
    {
      path: '/upload',
      method: HTTPMethods.POST,
      handler: this.handleUpload,
    },

    {
      path: '/get/:courseId/:lessonNumber',
      method: HTTPMethods.GET,
      handler: this.handleGet,
    },

    {
      path: '/delete',
      method: HTTPMethods.DELETE,
      handler: this.handleDelete,
    },

    {
      path: '/update',
      method: HTTPMethods.PATCH,
      handler: this.handleUpdate,
    },
  ];

  constructor() {
    super();
  }

  async handleUpload(request: Request, response: Response): Promise<void> {
    const video = request.files?.video as fileUpload.UploadedFile | undefined;
    const lessonNumber = request.body.lessonNumber as number;
    const courseId = request.body.courseId;
    const videoName = request.body.videoName;

    if (video === undefined) {
      super.error(
        response,
        FilesNotProvided.message,
        FilesNotProvided.statusCode
      );
      return;
    }

    if (lessonNumber === undefined || courseId === undefined) {
      super.error(
        response,
        RequireFieldNotProvided.message,
        RequireFieldNotProvided.statusCode
      );
      return;
    }

    const videoService = new VideoService();
    const data = await videoService.upload(
      video,
      courseId,
      videoName,
      lessonNumber
    );

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data, data.message);
  }

  async handleGet(request: Request, response: Response): Promise<void> {
    const rangeHeader = request.headers.range;
    const courseId = request.params.courseId;
    const lessonNumber = request.params.lessonNumber as unknown as number;

    if (rangeHeader === undefined) {
      super.error(
        response,
        RangeHeadersRequire.message,
        RangeHeadersRequire.statusCode
      );
      return;
    }

    const videoService = new VideoService();
    const courseVideo = await videoService.get(courseId, lessonNumber);

    if (!courseVideo.success) {
      super.error(response, courseVideo.message, courseVideo.statusCode);
      return;
    }

    const videoSize = fs.statSync(courseVideo.data!.path).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(rangeHeader.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    const videoStream = fs.createReadStream(courseVideo.data!.path, {
      start,
      end,
    });

    super.successStream(response, headers, videoStream);
  }

  async handleDelete(request: Request, response: Response): Promise<void> {
    const courseId = request.body.courseId;
    const lessonNumber = request.body.lessonNumber as number;

    if (courseId === undefined || lessonNumber === undefined) {
      super.error(
        response,
        RequireFieldNotProvided.message,
        RequireFieldNotProvided.statusCode
      );
    }

    const videoService = new VideoService();
    const data = await videoService.delete(courseId, lessonNumber);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    fs.unlinkSync(data.data!.path);
    super.success(response, data, data.message);
  }

  async handleUpdate(request: Request, response: Response): Promise<void> {
    const courseId = request.body.courseId;
    const lessonNumber = request.body.lessonNumber as number;
    const newName = request.body.newName;
    const newLessonNumber = request.body.newLessonNumber;

    if (courseId === undefined || lessonNumber === undefined) {
      super.error(
        response,
        RequireFieldNotProvided.message,
        RequireFieldNotProvided.statusCode
      );
      return;
    }

    const videoService = new VideoService();
    const data = await videoService.update(
      courseId,
      lessonNumber,
      newLessonNumber,
      newName
    );

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data, data.message);
  }
}
