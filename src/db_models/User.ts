import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface IUser extends Model {
  readonly id: string;
  username: string;
  password: string;
  email: string;
  type: string;
  courses: string[];
  avatarPath: string;
}

export type UserModelType = typeof Model & {
  new (values?: object, options?: BuildOptions): IUser;
};

export function getUser(sequelize: Sequelize): UserModelType {
  return <UserModelType>sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Must be a email adress.',
          },
        },
      },

      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      courses: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },

      avatarPath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
}
