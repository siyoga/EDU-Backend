import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface IToken extends Model {
  readonly id: number;
  refreshToken: string;
  readonly userId: string;
}

export type TokenModelType = typeof Model & {
  new (values?: object, options?: BuildOptions): IToken;
};

export function getToken(sequelize: Sequelize): TokenModelType {
  return <TokenModelType>sequelize.define(
    'token',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      refreshToken: {
        type: DataTypes.UUID,
        unique: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
}
