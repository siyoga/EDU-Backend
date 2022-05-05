import { Sequelize } from 'sequelize';
import { postgresConfig } from '../config';
import { getToken, IToken, TokenModelType } from './Token';
import { getUser, IUser, UserModelType } from './User';
import { getCourse, ICourse, CourseModelType } from './Course';
import { getVideo, VideoModelType } from './Video';

interface IDatabase {
  sequelize: Sequelize;
  User: UserModelType;
  Token: TokenModelType;
  Course: CourseModelType;
  Video: VideoModelType;
}

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
User.hasOne(Token);
Token.belongsTo(User);

Video.hasOne(Course);
Course.belongsTo(Video);

const database: IDatabase = {
  sequelize,
  User,
  Token,
  Course,
  Video,
};

database.sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((e) => console.log(e));

export default database;
export type UserModel = IUser;
export type TokenModel = IToken;
