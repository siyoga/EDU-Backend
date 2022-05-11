import { Request, Response } from 'express';

import CourseService from '../services/CourseService';
import UserService from '../services/UserService';
import Controller from '../typings/Controller';

import { decodeToken, getAuthHeader } from '../helper/auth';
import { HTTPMethods } from '../typings/Controller';

import {
  DoNotHavePermission,
  LoginToAccount,
  RequireFieldNotProvided,
} from '../output/errors';
import { ISafeCourseData } from '../typings';

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
      path: '/id/get/:id',
      method: HTTPMethods.GET,
      handler: this.handleGetById,
    },

    {
      path: '/author/get/:author',
      method: HTTPMethods.GET,
      handler: this.handleGetByAuthor,
    },

    {
      path: '/name/get/:name',
      method: HTTPMethods.GET,
      handler: this.handleGetByName,
    },

    {
      path: '/delete',
      method: HTTPMethods.DELETE,
      handler: this.handleDelete,
    },

    {
      path: '/student/add',
      method: HTTPMethods.GET,
      handler: this.handleAddStudent,
    },
  ];

  constructor() {
    super();
  }

  async handleCreate(request: Request, response: Response): Promise<void> {
    const name = request.body.name;
    const description = request.body.description;
    const author = request.body.author;

    if (
      name === undefined ||
      description === undefined ||
      author === undefined
    ) {
      super.error(
        response,
        RequireFieldNotProvided.message,
        RequireFieldNotProvided.statusCode
      );
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
    const userId = getAuthHeader(request);
    const courseId = request.body.courseId;
    const newName = request.body.newName;
    const newDescription = request.body.newDescription;

    if (userId === undefined) {
      super.error(response, LoginToAccount.message, LoginToAccount.statusCode);
      return;
    }

    const decodedUserId = decodeToken(userId);

    if (courseId === undefined) {
      super.error(
        response,
        RequireFieldNotProvided.message,
        RequireFieldNotProvided.statusCode
      );
      return;
    }

    const isAuthorValid = await this.checkAuthor(decodedUserId, courseId);

    if (!isAuthorValid) {
      super.error(
        response,
        DoNotHavePermission.message,
        DoNotHavePermission.statusCode
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

  async handleGetById(request: Request, response: Response): Promise<void> {
    const courseId = request.params.courseId;

    if (courseId === undefined) {
      super.error(
        response,
        RequireFieldNotProvided.message,
        RequireFieldNotProvided.statusCode
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
        RequireFieldNotProvided.message,
        RequireFieldNotProvided.statusCode
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
        RequireFieldNotProvided.message,
        RequireFieldNotProvided.statusCode
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
    const userId = getAuthHeader(request);
    const courseId = request.body.courseId;

    if (userId === undefined) {
      super.error(response, LoginToAccount.message, LoginToAccount.statusCode);
      return;
    }

    const decodedUserId = decodeToken(userId);

    if (courseId === undefined) {
      super.error(
        response,
        RequireFieldNotProvided.message,
        RequireFieldNotProvided.statusCode
      );
      return;
    }

    const isAuthorValid = await this.checkAuthor(decodedUserId, courseId);

    if (!isAuthorValid) {
      super.error(
        response,
        DoNotHavePermission.message,
        DoNotHavePermission.statusCode
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

  async handleAddStudent(request: Request, response: Response): Promise<void> {
    const id = request.body.id;

    const courseService = new CourseService();
    const data = await courseService.addStudent(id);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  private async checkAuthor(
    userId: string,
    courseId: string
  ): Promise<Boolean> {
    const courseService = new CourseService();
    const userService = new UserService();

    const author = (await userService.get(userId)).data!;
    const course = (await courseService.getByCourseId(courseId))
      .data! as ISafeCourseData;

    if (author.user.username !== course.author) {
      return false;
    }

    return true;
  }
}
