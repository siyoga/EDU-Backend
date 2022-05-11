import * as argon2 from 'argon2';

import database from '../db_models';

import { IUser } from '../db_models/User';
import { NoSuchUser, ServerError, InvalidPassword } from '../output/errors';
import {
  SuccessGet,
  SuccessUserEmailUpdate,
  SuccessUserPasswordUpdate,
  SuccessUsernameUpdate,
} from '../output/success';
import { ISafeUserData } from '../typings';

interface UserData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: ISafeUserData;
}

export default class UserService {
  public async get(userId: string): Promise<UserData> {
    try {
      const existUser = await database.User.findOne({
        where: { id: userId },
      });

      if (existUser === null) {
        return NoSuchUser;
      }

      const data = this.prepareResponse(existUser);
      return {
        statusCode: 200,
        message: SuccessGet.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  public async updateUserEmail(
    userId: string,
    newEmail: string
  ): Promise<UserData> {
    try {
      const existUser = await database.User.findOne({
        where: { id: userId },
      });

      if (existUser === null) {
        return NoSuchUser;
      }

      existUser.email = newEmail;
      await existUser.save();

      const data = this.prepareResponse(existUser);
      return {
        statusCode: 200,
        message: SuccessUserEmailUpdate.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  public async updateUsername(
    userId: string,
    newUsername: string
  ): Promise<UserData> {
    try {
      const existUser = await database.User.findOne({
        where: { id: userId },
      });

      if (existUser === null) {
        return NoSuchUser;
      }

      existUser.username = newUsername;
      await existUser.save();

      const data = this.prepareResponse(existUser);
      return {
        statusCode: 200,
        message: SuccessUsernameUpdate.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  public async updateUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<UserData> {
    try {
      const existUser = await database.User.findOne({
        where: { userId },
      });

      if (existUser === null) {
        return NoSuchUser;
      }

      const passwordValid = await argon2.verify(
        existUser!.password,
        oldPassword
      );

      if (!passwordValid) {
        return InvalidPassword;
      }

      const hashedPassword = await argon2.hash(newPassword);
      existUser.password = hashedPassword;
      await existUser.save();

      const data = this.prepareResponse(existUser);
      return {
        statusCode: 200,
        message: SuccessUserPasswordUpdate.message,
        success: true,
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
