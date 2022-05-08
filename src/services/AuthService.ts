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
  constructor(
    public username: string,
    public password: string,
    public type?: string,
    public email?: string,
    public userId?: string
  ) {}

  public async login(): Promise<AuthData> {
    try {
      const loggedInUser = await database.User.findOne({
        where: { username: this.username },
      });

      if (loggedInUser === null) {
        return NoSuchUser;
      }

      const passwordValid = await argon2.verify(
        loggedInUser!.password,
        this.password
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

  public async logout(): Promise<AuthData> {
    try {
      if (this.userId === undefined) {
        return LoginToAccount;
      }

      const decodedUserId = jwt.verify(this.userId, accessToken) as ICryptToken;
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

  public async register(): Promise<AuthData> {
    try {
      const existUser = await database.User.findOne({
        where: { username: this.username },
      });

      if (existUser !== null) {
        return UserAlreadyExist;
      }

      if (this.email === undefined || this.type === undefined) {
        return RequireFieldNotProvided;
      }

      const hashedPassword = await argon2.hash(this.password);

      await database.User.create({
        email: this.email,
        type: this.type.toUpperCase(),
        username: this.username,
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

  public async refresh(): Promise<AuthData> {
    try {
      if (this.userId === undefined) {
        return LoginToAccount;
      }

      const decodedUserId = jwt.verify(this.userId, accessToken) as ICryptToken;
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
