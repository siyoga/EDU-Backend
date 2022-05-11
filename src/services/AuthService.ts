import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import database from '../db_models';
import * as uuid from 'uuid';

import { IUser } from '../db_models/User';
import {
  TokenNotFound,
  InvalidPassword,
  LoginToAccount,
  NoSuchUser,
  ServerError,
  UserAlreadyExist,
  RequireFieldNotProvided,
} from '../output/errors';
import {
  SuccessLogin,
  SuccessLogout,
  SuccessRegister,
  SuccessTokenRefresh,
} from '../output/success';
import { ICryptToken, ISafeToken, ISafeUserData } from '../typings/index';
import { accessToken } from '../../config';

interface AuthData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: object;
}

export default class AuthService {
  public async login(username: string, password: string): Promise<AuthData> {
    try {
      const loggedInUser = await database.User.findOne({
        where: { username: username },
      });

      if (loggedInUser === null) {
        return NoSuchUser;
      }

      const passwordValid = await argon2.verify(
        loggedInUser.password,
        password
      );

      if (!passwordValid) {
        return InvalidPassword;
      }

      const data = await this.generateUserData(loggedInUser!);

      return {
        statusCode: 200,
        message: SuccessLogin.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  public async logout(userId: string): Promise<AuthData> {
    try {
      const decodedUserId = jwt.verify(userId, accessToken) as ICryptToken;
      await database.Token.destroy({
        where: {
          userId: decodedUserId.userId,
        },
      });

      return {
        statusCode: 200,
        message: SuccessLogout.message,
        success: true,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  public async register(
    username: string,
    password: string,
    email: string,
    type: string
  ): Promise<AuthData> {
    try {
      const existUser = await database.User.findOne({
        where: { username: username },
      });

      if (existUser !== null) {
        return UserAlreadyExist;
      }

      const hashedPassword = await argon2.hash(password);

      await database.User.create({
        email: email,
        type: type.toUpperCase(),
        username: username,
        password: hashedPassword,
      });

      return {
        statusCode: 200,
        message: SuccessRegister.message,
        success: true,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  public async refresh(userId: string): Promise<AuthData> {
    try {
      const decodedUserId = jwt.verify(userId, accessToken) as ICryptToken;
      const dbToken = await database.Token.findOne({
        where: {
          userId: decodedUserId.userId,
        },
      });

      if (dbToken === null) {
        return TokenNotFound;
      }

      dbToken.refreshToken = uuid.v4();
      await dbToken.save();

      const data = this.generateTokenPair(dbToken.userId);
      return {
        statusCode: 200,
        message: SuccessTokenRefresh.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  private async generateTokenPair(userId: string): Promise<ISafeToken> {
    console.log(accessToken);
    const refreshToken = uuid.v4();
    await database.Token.create({
      refreshToken: refreshToken,
      userId: userId,
    });

    return {
      token: jwt.sign({ userId: userId }, accessToken),
      refreshToken: refreshToken,
    };
  }

  private async generateUserData(user: IUser): Promise<ISafeUserData> {
    const tokenPair = await this.generateTokenPair(user.id);

    console.log(tokenPair);

    const data: ISafeUserData = {
      user: {
        username: user.username,
        email: user.email!,
      },
      tokenPair: tokenPair,
    };

    return data;
  }
}
