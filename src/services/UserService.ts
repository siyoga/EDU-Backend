import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import database from '../db_models';
import { IUser } from '../db_models/User';
import {
  InvalidPassword,
  NoSuchUser,
  ServerError,
  UserAlreadyExist,
} from '../output/errors';
import { SuccessLogin, SuccessRegister } from '../output/success';
import { ISafeData } from '../typings';

interface AuthData {
  message: string;
  success: boolean;
  data?: object;
}

export default class UserService {
  constructor(
    public username: string,
    public password: string,
    public email?: string
  ) {}

  public async login(): Promise<AuthData> {
    try {
      const user = await database.User.findOne({
        where: { username: this.username },
      });

      if (user !== null) {
        const passwordValid = await argon2.verify(
          user!.password,
          this.password
        );

        if (passwordValid) {
          const data = this.prepareResponse(user!);

          return {
            message: SuccessLogin.message,
            success: SuccessLogin.success,
            data: data,
          };
        } else {
          return InvalidPassword;
        }
      } else {
        return NoSuchUser;
      }
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
      if (existUser === null) {
        const hashedPassword = await argon2.hash(this.password);
        const newUser = await database.User.create({
          email: this.email,
          username: this.username,
          password: hashedPassword,
        });

        const data = this.prepareResponse(newUser);
        return {
          message: SuccessRegister.message,
          success: SuccessRegister.success,
          data: data,
        };
      } else {
        return UserAlreadyExist;
      }
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  private prepareResponse(user: IUser): ISafeData {
    dotenv.config();
    const token = jwt.sign(this.username, process.env.TOKEN_SECRET!, {
      expiresIn: 60 * 60 * 60 * 24 * 30, // 30 days
    });
    const data: ISafeData = {
      user: {
        username: user.username,
        email: user.email!,
      },
      jwt: token,
    };

    return data;
  }
}
