import { Request, Response } from 'express';
import { getAuthHeader } from '../helper/auth';
import AuthService from '../services/AuthService';

import Controller, { HTTPMethods } from '../typings/Controller';

export default class AuthController extends Controller {
  path = '/auth';
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
    {
      path: '/logout',
      method: HTTPMethods.POST,
      handler: this.handleLogout,
    },
  ];

  constructor() {
    super();
  }

  async handleLogin(request: Request, response: Response): Promise<void> {
    try {
      const username = request.body.username;
      const password = request.body.password;

      const authService = new AuthService(username, password);
      const data = await authService.login();
      if (!data.success) {
        super.error(response, data.message, data.statusCode);
        return;
      }

      super.success(response, data.data!, data.message);
    } catch (e) {
      console.log(e);
      super.error(response);
    }
  }

  async handleRegister(request: Request, response: Response): Promise<void> {
    try {
      const username = request.body.username;
      const password = request.body.password;
      const email = request.body.email;

      const authService = new AuthService(username, password, email);
      const data = await authService.register();
      if (!data.success) {
        super.error(response, data.message, data.statusCode);
        return;
      }

      super.success(response, data.data!, data.message);
    } catch (e) {
      console.log(e);
      super.error(response);
    }
  }

  async handleLogout(request: Request, response: Response): Promise<void> {
    try {
      const userId = getAuthHeader(request);
      const username = request.body.username;
      const password = request.body.password;
      const email = request.body.email;

      const authService = new AuthService(username, password, email, userId);
      const data = await authService.logout();
      if (!data.success) {
        super.error(response, data.message, data.statusCode);
      }

      super.success(response, data.data!, data.message);
    } catch (e) {
      console.log(e);
      super.error(response);
    }
  }
}
