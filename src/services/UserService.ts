import jwt from 'jsonwebtoken';
import { accessToken } from '../config';

import database from '../db_models';

import { IUser } from '../db_models/User';
import { NoSuchUser, ServerError } from '../output/errors';
import { SuccessGet } from '../output/success';
import { ICryptToken, ISafeToken, ISafeUserData } from '../typings';

interface UserData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: object;
}

export default class UserService {
  constructor(public userId: string) {}

  public async get(): Promise<UserData> {
    try {
      const decodedUserId = jwt.verify(this.userId, accessToken) as ICryptToken;
      const existUser = await database.User.findOne({
        where: { id: decodedUserId.userId },
      });

      if (existUser === null) {
        return NoSuchUser;
      }

      const data = this.prepareResponse(existUser);
      return {
        statusCode: SuccessGet.statusCode,
        message: SuccessGet.message,
        success: SuccessGet.success,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  private prepareResponse(user: IUser): ISafeUserData {
    const data: ISafeUserData = {
      user: {
        username: user.username,
        email: user.email!,
      },
    };

    return data;
  }
}
