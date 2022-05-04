import { Sequelize } from 'sequelize';
import { postgresConfig } from '../config';
import { getToken, IToken, TokenModelType } from './Token';
import { getUser, IUser, UserModelType } from './User';
import { getCourse, ICourse, CourseModelType } from './Course';

interface IDatabase {
  sequelize: Sequelize;
  User: UserModelType;
  Token: TokenModelType;
  Course: CourseModelType;
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
User.hasOne(Token);
Token.belongsTo(User);

const database: IDatabase = {
  sequelize,
  User,
  Token,
  Course,
};

database.sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((e) => console.log(e));

export default database;
export type UserModel = IUser;
export type TokenModel = IToken;
