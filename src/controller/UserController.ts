import mime from 'mime';

import { Response, Request } from 'express';

import Controller from '../typings/Controller';
import UserService from '../services/UserService';

import { HTTPMethods } from '../typings/Controller';
import { ServerIssues } from '../output/errors';
import { decodeToken, getAuthHeader } from '../helper/auth';
import fileUpload from 'express-fileupload';
import CourseService from '../services/CourseService';

export default class UserController extends Controller {
  path = '/user';
  routes = [
    {
      path: '/get',
      method: HTTPMethods.GET,
      handler: this.handleGet,
    },
    {
      path: '/updateAvatar',
      method: HTTPMethods.PATCH,
      handler: this.handleUploadAvatar,
    },
    {
      path: '/updateUserEmail',
      method: HTTPMethods.PATCH,
      handler: this.handleUpdateEmail,
    },
    {
      path: '/updateUsername',
      method: HTTPMethods.PATCH,
      handler: this.handleUpdateUsername,
    },
    {
      path: '/updateUserPassword',
      method: HTTPMethods.PATCH,
      handler: this.handleUpdatePassword,
    },
    {
      path: '/subscribeOnCourse',
      method: HTTPMethods.PATCH,
      handler: this.handleSubscribe,
    },
    {
      path: '/unsubscribeOnCourse',
      method: HTTPMethods.PATCH,
      handler: this.handleUnsubscribe,
    },
  ];

  constructor() {
    super();
  }

  // USER INFO

  async handleGet(request: Request, response: Response): Promise<void> {
    const userId = getAuthHeader(request);

    if (userId === undefined) {
      super.error(
        response,
        ServerIssues.LoginToAccount.message,
        ServerIssues.LoginToAccount.statusCode
      );
      return;
    }

    const decodedUserId = decodeToken(userId);
    const userService = new UserService();
    const data = await userService.get(decodedUserId);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  // UPDATE USER PARAMS

  async handleUploadAvatar(
    request: Request,
    response: Response
  ): Promise<void> {
    const userId = getAuthHeader(request);
    const avatar = request.files?.avatar as fileUpload.UploadedFile | undefined;

    if (userId === undefined) {
      super.error(
        response,
        ServerIssues.FilesNotProvided.message,
        ServerIssues.FilesNotProvided.statusCode
      );
      return;
    }

    if (avatar === undefined) {
      super.error(
        response,
        ServerIssues.FilesNotProvided.message,
        ServerIssues.FilesNotProvided.statusCode
      );
      return;
    }

    if (mime.getType(avatar.name) !== 'image/png') {
      super.error(
        response,
        ServerIssues.FileCanNotBeUpload.message,
        ServerIssues.FileCanNotBeUpload.statusCode
      );
      return;
    }

    const decodedUserId = decodeToken(userId);
    const userService = new UserService();
    const data = await userService.updateUserAvatar(decodedUserId, avatar);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data, data.message);
  }

  async handleUpdateEmail(request: Request, response: Response): Promise<void> {
    const userId = getAuthHeader(request);
    const newEmail = request.body.newEmail;

    if (userId === undefined) {
      super.error(
        response,
        ServerIssues.LoginToAccount.message,
        ServerIssues.LoginToAccount.statusCode
      );
      return;
    }

    if (newEmail === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const decodedUserId = decodeToken(userId);
    const userService = new UserService();
    const data = await userService.updateUserEmail(decodedUserId, newEmail);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleUpdateUsername(
    request: Request,
    response: Response
  ): Promise<void> {
    const userId = getAuthHeader(request);
    const newUsername = request.body.newUsername;

    if (userId === undefined) {
      super.error(
        response,
        ServerIssues.LoginToAccount.message,
        ServerIssues.LoginToAccount.statusCode
      );
      return;
    }

    if (newUsername === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const decodedUserId = decodeToken(userId);
    const userService = new UserService();
    const data = await userService.updateUsername(decodedUserId, newUsername);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleUpdatePassword(
    request: Request,
    response: Response
  ): Promise<void> {
    const userId = getAuthHeader(request);
    const oldPassword = request.body.oldPassword;
    const newPassword = request.body.newPassword;

    if (userId === undefined) {
      super.error(
        response,
        ServerIssues.LoginToAccount.message,
        ServerIssues.LoginToAccount.statusCode
      );
      return;
    }

    if (oldPassword === undefined || newPassword === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const decodedUserId = decodeToken(userId);
    const userService = new UserService();
    const data = await userService.updateUserPassword(
      decodedUserId,
      oldPassword,
      newPassword
    );

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  // COURSES CONTROL

  async handleSubscribe(request: Request, response: Response) {
    const userId = getAuthHeader(request);
    const courseId = request.body.courseId as string;

    if (userId === undefined) {
      super.error(
        response,
        ServerIssues.LoginToAccount.message,
        ServerIssues.LoginToAccount.statusCode
      );
      return;
    }

    if (courseId === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const courseService = new CourseService();
    const courseData = await courseService.addStudent(courseId);

    if (!courseData.success) {
      super.error(response, courseData.message, courseData.statusCode);
      return;
    }

    const decodedUserId = decodeToken(userId);
    const userService = new UserService();
    const userData = await userService.subscribeOnCourse(
      decodedUserId,
      courseId
    );

    if (!userData.success) {
      super.error(response, userData.message, userData.statusCode);
      return;
    }

    super.success(response, userData.data!, userData.message);
  }

  async handleUnsubscribe(request: Request, response: Response) {
    const userId = getAuthHeader(request);
    const courseId = request.body.courseId as string;

    if (userId === undefined) {
      super.error(
        response,
        ServerIssues.LoginToAccount.message,
        ServerIssues.LoginToAccount.statusCode
      );
      return;
    }

    if (courseId === undefined) {
      super.error(
        response,
        ServerIssues.RequireFieldNotProvided.message,
        ServerIssues.RequireFieldNotProvided.statusCode
      );
      return;
    }

    const courseService = new CourseService();
    const courseData = await courseService.removeStudent(courseId);

    if (!courseData.success) {
      super.error(response, courseData.message, courseData.statusCode);
      return;
    }

    const decodedUserId = decodeToken(userId);
    const userService = new UserService();
    const userData = await userService.unsubscribeOnCourse(
      decodedUserId,
      courseId
    );

    if (!userData.success) {
      super.error(response, userData.message, userData.statusCode);
      return;
    }

    super.success(response, userData.data!, userData.message);
  }
}
