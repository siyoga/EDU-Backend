import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface IText extends Model {
  readonly id: string;
  name: string;
  path: string;
  lessonNumber: number;
  courseId: string;
}

export type TextModelType = typeof Model & {
  new (values?: object, options?: BuildOptions): IText;
};

export function getText(sequelize: Sequelize): TextModelType {
  return <TextModelType>sequelize.define(
    'text',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lessonNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
}
