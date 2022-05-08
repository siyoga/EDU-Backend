import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface IVideo extends Model {
  readonly id: string;
  name: string;
  path: string;
  courseId: string;
}

export type VideoModelType = typeof Model & {
  new (values?: object, options?: BuildOptions): IVideo;
};

export function getVideo(sequelize: Sequelize): VideoModelType {
  return <VideoModelType>sequelize.define(
    'videos',
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
    },
    {
      freezeTableName: true,
    }
  );
}
