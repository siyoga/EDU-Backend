import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface ICourse extends Model {
  readonly id: string;
  name: string;
  description: string;
  author: string;
  studentsCount: number;
}

export type CourseModelType = typeof Model & {
  new (values?: object, options?: BuildOptions): ICourse;
};

export function getCourse(sequelize: Sequelize): CourseModelType {
  return <CourseModelType>sequelize.define('course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    studentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
}
