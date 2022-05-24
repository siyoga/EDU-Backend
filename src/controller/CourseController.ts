import { Request, Response } from 'express';

import CourseService from '../services/CourseService';
import Controller from '../typings/Controller';

import { HTTPMethods } from '../typings/Controller';

import { ServerIssues } from '../output/errors';

export default class CourseController extends Controller {
  path = '/course';
  routes = [
    {
      path: '/create',
      method: HTTPMethods.POST,
      handler: this.handleCreate,
    },

    {
      path: '/update',
      method: HTTPMethods.PATCH,
      handler: this.handleUpdate,
    },

    {
      path: '/get/all',
      method: HTTPMethods.GET,
      handler: this.handleGetAllCourses,
    },

    {
      path: '/get/id/:courseId',
      method: HTTPMethods.GET,
      handler: this.handleGetByCourseId,
    },

    {
      path: '/get/author/:author',
      method: HTTPMethods.GET,
      handler: this.handleGetByAuthor,
    },

    {
      path: '/get/name/:name',
      method: HTTPMethods.GET,
      handler: this.handleGetByName,
    },

    {
      path: '/delete',
      method: HTTPMethods.DELETE,
      handler: this.handleDelete,
    },
  ];

  constructor() {
    super();
  }

  async handleCreate(request: Request, response: Response): Promise<void> {
    const name = request.body.name;
    const description = request.body.description;
    const author = request.body.author;
    const userType = request.body.userType;

    if (
      name === undefined ||
      description === undefined ||
      author === undefined ||
      userType === undefined
    ) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
    }

    if (userType !== 'TEACHER') {
      super.error(
        response,
        ServerIssues.DoNotHavePermission.message,
        ServerIssues.DoNotHavePermission.statusCode
      );
      return;
    }

    const courseService = new CourseService();
    const data = await courseService.create(name, description, author);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleUpdate(request: Request, response: Response): Promise<void> {
    const courseId = request.body.courseId;
    const newName = request.body.newName;
    const newDescription = request.body.newDescription;

    if (courseId === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const courseService = new CourseService();
    const data = await courseService.update(courseId, newName, newDescription);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleGetAllCourses(request: Request, response: Response) {
    const courseService = new CourseService();
    const data = await courseService.getAllCourses();

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleGetByCourseId(
    request: Request,
    response: Response
  ): Promise<void> {
    const courseId = request.params.courseId;

    if (courseId === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const courseService = new CourseService();
    const data = await courseService.getByCourseId(courseId);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleGetByAuthor(request: Request, response: Response): Promise<void> {
    const author = request.params.author;

    if (author === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const courseService = new CourseService();
    const data = await courseService.getByAuthor(author);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleGetByName(request: Request, response: Response): Promise<void> {
    const name = request.params.name;

    if (name === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const courseService = new CourseService();
    const data = await courseService.getByName(name);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleDelete(request: Request, response: Response): Promise<void> {
    const courseId = request.body.courseId;

    if (courseId === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const courseService = new CourseService();
    const data = await courseService.delete(courseId);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }
}
