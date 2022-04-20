import { Request, Response } from 'express';
import UserService from '../services/UserService';

import Controller, { HTTPMethods } from '../typings/Controller';

export default class AuthController extends Controller {
  path = '/';
  routes = [
    {
      path: '/login',
      method: HTTPMethods.POST,
      handler: this.handleLogin,
    },
    {
      path: '/register',
      method: HTTPMethods.POST,
      handler: this.handleRegister,
    },
  ];

  constructor() {
    super();
  }

  async handleLogin(req: Request, res: Response): Promise<void> {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const userService = new UserService(username, password);
      const data = await userService.login();
      if (data.success) {
        super.success(res, data.data!, data.message);
      } else {
        super.error(res, data.message);
      }
    } catch (e) {
      console.log(e);
      super.error(res);
    }
  }

  async handleRegister(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);
      const username = req.body.username;
      const password = req.body.password;
      const email = req.body.email;

      const userService = new UserService(username, password, email);
      const data = await userService.register();
      if (data.success) {
        super.success(res, data.data!, data.message);
      } else {
        super.error(res, data.message, 401);
      }
    } catch (e) {
      console.log(e);
      super.error(res);
    }
  }
}
