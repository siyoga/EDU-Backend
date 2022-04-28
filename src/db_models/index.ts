import { Sequelize } from 'sequelize';
import { postgresCredentials } from '../config';
import { getToken, IToken, TokenModelType } from './Token';
import { getUser, IUser, UserModelType } from './User';

interface IDatabase {
  sequelize: Sequelize;
  User: UserModelType;
  Token: TokenModelType;
}

const sequelize = new Sequelize(
  postgresCredentials.database,
  postgresCredentials.username,
  postgresCredentials.password,
  {
    host: postgresCredentials.host,
    dialect: 'postgres',
  }
);

const User = getUser(sequelize);
const Token = getToken(sequelize);
User.hasOne(Token);
Token.belongsTo(User);

const database: IDatabase = {
  sequelize,
  User,
  Token,
};

database.sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((e) => console.log(e));

export default database;
export type UserModel = IUser;
export type TokenModel = IToken;
