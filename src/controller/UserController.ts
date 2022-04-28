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
}
