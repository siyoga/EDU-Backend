import { Response, Request } from 'express';

import { HTTPMethods } from '../typings/Controller';
import { LoginToAccount } from '../output/errors';
import Controller from '../typings/Controller';
import UserService from '../services/UserService';
import { getAuthHeader } from '../helper/auth';

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
      super.error(response, LoginToAccount.message, LoginToAccount.statusCode);
      return;
    }

    const userService = new UserService(userId);
    const data = await userService.get();

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
    }

    super.success(response, data.data!, data.message);
  }

  async handleUpdateEmail(request: Request, response: Response): Promise<void> {
    const userId = getAuthHeader(request);
    const email = request.body.newEmail;

    if (userId === undefined) {
      super.error(response, LoginToAccount.message, LoginToAccount.statusCode);
      return;
    }

    const userService = new UserService(userId);
    const data = await userService.updateUserEmail(email);

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
    const username = request.body.username;

    if (userId === undefined) {
      super.error(response, LoginToAccount.message, LoginToAccount.statusCode);
      return;
    }

    const userService = new UserService(userId);
    const data = await userService.updateUsername(username);

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
      super.error(response, LoginToAccount.message, LoginToAccount.statusCode);
      return;
    }

    const userService = new UserService(userId);
    const data = await userService.updateUserPassword(oldPassword, newPassword);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
    return;
  }
}
