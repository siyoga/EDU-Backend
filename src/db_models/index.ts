import { Sequelize } from 'sequelize';
import { postgresConfig } from '../../config';
import { getToken, IToken, TokenModelType } from './Token';
import { getUser, IUser, UserModelType } from './User';
import { getCourse, ICourse, CourseModelType } from './Course';
import { getVideo, VideoModelType } from './Video';
import { getText, TextModelType } from './Text';

interface IDatabase {
  sequelize: Sequelize;
  User: UserModelType;
  Token: TokenModelType;
  Course: CourseModelType;
  Video: VideoModelType;
  Text: TextModelType;
}

console.log(postgresConfig.host);

const sequelize = new Sequelize(
  postgresConfig.database,
  postgresConfig.username,
  postgresConfig.password,
  {
    host: postgresConfig.host,
    dialect: 'postgres',
  }
);

const User = getUser(sequelize);
const Token = getToken(sequelize);
const Course = getCourse(sequelize);
const Video = getVideo(sequelize);
const Text = getText(sequelize);
User.hasOne(Token);
Token.belongsTo(User);

Course.hasOne(Video);
Video.belongsTo(Course);

Course.hasOne(Text);
Text.belongsTo(Course);

const database: IDatabase = {
  sequelize,
  User,
  Token,
  Course,
  Video,
  Text,
};

export default database;
export type UserModel = IUser;
export type TokenModel = IToken;
