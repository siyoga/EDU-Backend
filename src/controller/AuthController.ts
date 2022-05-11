import { Request, Response } from 'express';

import AuthService from '../services/AuthService';
import Controller from '../typings/Controller';

import { getAuthHeader } from '../helper/auth';
import { HTTPMethods } from '../typings/Controller';

import { ServerIssues } from '../output/errors';

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
      method: HTTPMethods.GET,
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

      if (username === undefined || password === undefined) {
        super.error(
          response,
          ServerIssues.RequireFieldNotProvided.message,
          ServerIssues.RequireFieldNotProvided.statusCode
        );
        return;
      }

      const authService = new AuthService();
      const data = await authService.login(username, password);

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
      const type = request.body.type;

      if (
        username === undefined ||
        password === undefined ||
        email === undefined ||
        type === undefined
      ) {
        super.error(
          response,
          ServerIssues.RequireFieldNotProvided.message,
          ServerIssues.RequireFieldNotProvided.statusCode
        );
        return;
      }

      const authService = new AuthService();
      const data = await authService.register(username, password, email, type);
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

      if (userId === undefined) {
        super.error(
          response,
          ServerIssues.LoginToAccount.message,
          ServerIssues.LoginToAccount.statusCode
        );
        return;
      }

      const authService = new AuthService();
      const data = await authService.logout(userId);
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
