import { Response, Request } from 'express';

import Controller from '../typings/Controller';
import UserService from '../services/UserService';

import { HTTPMethods } from '../typings/Controller';
import { ServerIssues } from '../output/errors';
import { decodeToken, getAuthHeader } from '../helper/auth';

export default class UserController extends Controller {
  path = '/user';
  routes = [
    {
      path: '/get',
      method: HTTPMethods.GET,
      handler: this.handleGet,
    },
    {
      path: '/updateUserEmail',
      method: HTTPMethods.POST,
      handler: this.handleUpdateEmail,
    },
    {
      path: '/updateUsername',
      method: HTTPMethods.POST,
      handler: this.handleUpdateUsername,
    },
    {
      path: '/updateUserPassword',
      method: HTTPMethods.POST,
      handler: this.handleUpdatePassword,
    },
  ];

  constructor() {
    super();
  }

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
    }

    super.success(response, data.data!, data.message);
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
    return;
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
    return;
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
    return;
  }
}
