import fileUpload from 'express-fileupload';
import fs from 'fs';
import { Request, Response } from 'express';

import { HTTPMethods } from '../typings/Controller';
import Controller from '../typings/Controller';
import TextService from '../services/TextService';

import { ServerIssues } from '../output/errors';

export default class TextController extends Controller {
  path = '/text';
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
    const text = request.files?.text as fileUpload.UploadedFile | undefined;
    const lessonNumber = request.body.lessonNumber as number;
    const courseId = request.body.courseId;
    const textName = request.body.textName;

    if (text === undefined) {
      super.error(
        response,
        ServerIssues.FilesNotProvided.message,
        ServerIssues.FilesNotProvided.statusCode
      );
      return;
    }

    if (lessonNumber === undefined || courseId === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const textService = new TextService();
    const data = await textService.upload(
      text,
      courseId,
      textName,
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
        ServerIssues.RangeHeadersRequire.message,
        ServerIssues.RangeHeadersRequire.statusCode
      );
      return;
    }

    const textService = new TextService();
    const courseText = await textService.get(courseId, lessonNumber);

    if (!courseText.success) {
      super.error(response, courseText.message, courseText.statusCode);
      return;
    }

    const textSize = fs.statSync(courseText.data!.path).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(rangeHeader.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, textSize - 1);
    const contentLength = end - start + 1;

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${textSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'text/txt',
    };

    const textStream = fs.createReadStream(courseText.data!.path, {
      start,
      end,
    });

    super.successStream(response, headers, textStream);
  }

  async handleDelete(request: Request, response: Response): Promise<void> {
    const courseId = request.body.courseId;
    const lessonNumber = request.body.lessonNumber as number;

    if (courseId === undefined || lessonNumber === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
    }

    const textService = new TextService();
    const data = await textService.delete(courseId, lessonNumber);

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
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const textService = new TextService();
    const data = await textService.update(
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