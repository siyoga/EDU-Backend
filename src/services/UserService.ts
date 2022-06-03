import * as argon2 from 'argon2';
import fs from 'fs';

import database from '../db_models';

import { UploadedFile } from 'express-fileupload';
import { destinationPath } from '../../config';

import { IUser } from '../db_models/User';
import { DatabaseIssues, ServerIssues } from '../output/errors';
import {
  SuccessGet,
  SuccessUserEmailUpdate,
  SuccessUserPasswordUpdate,
  SuccessUsernameUpdate,
  SuccessAvatarUpdate,
  SuccessSubscribe,
  SuccessUnsubscribe,
} from '../output/success';
import { ISafeUserData } from '../typings';

interface UserData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: ISafeUserData;
}

export default class UserService {
  // GET

  public async get(userId: string): Promise<UserData> {
    try {
      const existUser = await database.User.findOne({
        where: { id: userId },
      });

      if (existUser === null) {
        return DatabaseIssues.NoSuchUser;
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
      return ServerIssues.ServerError;
    }
  }

  // UPDATE INFO

  public async updateUserAvatar(
    userId: string,
    file: UploadedFile
  ): Promise<UserData> {
    try {
      const existUser = await database.User.findOne({
        where: {
          id: userId,
        },
      });

      if (existUser === null) {
        return DatabaseIssues.NoSuchUser;
      }

      let path = `${destinationPath}/avatars/`;

      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }

      path = `${destinationPath}/avatars/${file.name}`;

      file.mv(path, (e) => {
        if (e) {
          return DatabaseIssues.FileCannotBeUpload;
        }
      });

      existUser.avatarPath = path;
      await existUser.save();

      const data = this.prepareResponse(existUser);

      return {
        statusCode: 200,
        message: SuccessAvatarUpdate.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
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
        return DatabaseIssues.NoSuchUser;
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
      return ServerIssues.ServerError;
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
        return DatabaseIssues.NoSuchUser;
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
      return ServerIssues.ServerError;
    }
  }

  public async updateUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<UserData> {
    try {
      const existUser = await database.User.findOne({
        where: { id: userId },
      });

      if (existUser === null) {
        return DatabaseIssues.NoSuchUser;
      }

      const passwordValid = await argon2.verify(
        existUser!.password,
        oldPassword
      );

      if (!passwordValid) {
        return DatabaseIssues.InvalidCreds;
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
      return ServerIssues.ServerError;
    }
  }

  // COURSE CONTROL

  public async subscribeOnCourse(
    userId: string,
    courseId: string
  ): Promise<UserData> {
    try {
      const existUser = await database.User.findOne({
        where: {
          id: userId,
        },
      });

      if (existUser === null) {
        return DatabaseIssues.NoSuchUser;
      }

      if (existUser.type === 'TEACHER') {
        return DatabaseIssues.CourseNotAvaliable;
      }

      if (existUser.courses === null) {
        const courses: string[] = [courseId];
        existUser.courses = courses;
      } else if (existUser.courses.length === 0) {
        const courses: string[] = [courseId];
        existUser.courses = courses;
      } else if (existUser.courses === []) {
        const courses: string[] = [courseId];
        existUser.courses = courses;
      } else {
        if (existUser.courses.indexOf(courseId) !== -1) {
          return DatabaseIssues.CourseAlreadySub;
        }

        existUser.courses.push(courseId);
      }

      await existUser.save();

      const data = this.prepareResponse(existUser);

      return {
        statusCode: 200,
        message: SuccessSubscribe.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  public async unsubscribeOnCourse(
    userId: string,
    courseId: string
  ): Promise<UserData> {
    try {
      const existUser = await database.User.findOne({
        where: {
          id: userId,
        },
      });

      if (existUser === null) {
        return DatabaseIssues.NoSuchUser;
      }

      if (existUser.courses.length === 1) {
        existUser.courses = [];
      } else {
        const index = existUser.courses.indexOf(courseId);
        console.log(index);
        existUser.courses.splice(index, 1);
      }

      await existUser.save();

      const data = this.prepareResponse(existUser);
      return {
        statusCode: 200,
        message: SuccessUnsubscribe.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  // HELPER

  private prepareResponse(user: IUser): ISafeUserData {
    const data: ISafeUserData = {
      user: {
        username: user.username,
        email: user.email!,
        type: user.type,
        courses: user.courses,
        avatarPath: user.avatarPath,
      },
    };

    return data;
  }
}
