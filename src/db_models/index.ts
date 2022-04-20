import { Sequelize } from 'sequelize';
import { postgresCredentials } from '../config';
import { getUser, IUser, UserModelType } from './User';

interface IDatabase {
  sequelize: Sequelize;
  User: UserModelType;
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

const database: IDatabase = {
  sequelize,
  User,
};

database.sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((e) => console.log(e));

export default database;
export type UserModel = IUser;
