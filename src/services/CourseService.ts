import { Op } from 'sequelize';
import database from '../db_models';
import { ICourse } from '../db_models/Course';
import { DatabaseIssues, ServerIssues } from '../output/errors';
import {
  SuccessCourseCreated,
  SuccessCourseDelete,
  SuccessCourseGet,
  SuccessCourseUpdate,
  SuccessStudentEdited,
} from '../output/success';
import { ISafeCourseData } from '../typings';

interface CourseData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: ISafeCourseData | ISafeCourseData[];
}

export default class CourseService {
  public async create(
    name: string,
    description: string,
    author: string
  ): Promise<CourseData> {
    try {
      const foundCourse = await database.Course.findOne({
        where: { author: author, name: name },
      });

      if (foundCourse !== null) {
        return DatabaseIssues.CourseAlreadyExist;
      }

      const createdCourse = await database.Course.create({
        name: name,
        description: description,
        author: author,
      });

      const data = this.prepareResponse(createdCourse);
      return {
        statusCode: 200,
        message: SuccessCourseCreated.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  public async update(
    courseId: string,
    newName?: string,
    newDescription?: string
  ): Promise<CourseData> {
    try {
      const foundCourse = await database.Course.findOne({
        where: {
          id: courseId,
        },
      });

      if (foundCourse === null) {
        return DatabaseIssues.CourseNotFound;
      }

      if (newName !== undefined) {
        foundCourse.name = newName;
      }

      if (newDescription !== undefined) {
        foundCourse.description = newDescription;
      }

      await foundCourse.save();

      const data = this.prepareResponse(foundCourse);
      return {
        statusCode: 200,
        message: SuccessCourseUpdate.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  public async getByCourseId(courseId: string): Promise<CourseData> {
    try {
      const foundCourse = await database.Course.findOne({
        where: {
          id: courseId,
        },
      });

      if (foundCourse === null) {
        return DatabaseIssues.CourseNotFound;
      }

      const data = this.prepareResponse(foundCourse);
      return {
        statusCode: 200,
        message: SuccessCourseGet.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  public async getByAuthor(author: string): Promise<CourseData> {
    try {
      const data: ISafeCourseData[] = [];
      const foundCourses = await database.Course.findAll({
        where: {
          author: author,
        },
      });

      if (foundCourses === null) {
        return DatabaseIssues.CourseNotFound;
      }

      foundCourses.forEach((element) => {
        data.push(this.prepareResponse(element));
      });

      return {
        statusCode: 200,
        message: SuccessCourseGet.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  public async getByName(name: string): Promise<CourseData> {
    try {
      const data: ISafeCourseData[] = [];
      const foundCourses = await database.Course.findAll({
        where: {
          name: {
            [Op.or]: {
              [Op.like]: `%${name}%`,
            },
          },
        },
      });

      if (foundCourses === null) {
        return DatabaseIssues.CourseNotFound;
      }

      foundCourses.forEach((element) => {
        data.push(this.prepareResponse(element));
      });

      return {
        statusCode: 200,
        message: SuccessCourseGet.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  public async delete(id: string): Promise<CourseData> {
    try {
      const foundCourse = await database.Course.findOne({
        where: {
          id: id,
        },
      });

      if (foundCourse === null) {
        return DatabaseIssues.CourseNotFound;
      }

      await foundCourse.destroy();
      return {
        statusCode: 200,
        message: SuccessCourseDelete.message,
        success: true,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  public async addStudent(courseId: string): Promise<CourseData> {
    try {
      const foundCourse = await database.Course.findOne({
        where: {
          id: courseId,
        },
      });

      if (foundCourse === null) {
        return DatabaseIssues.CourseNotFound;
      }

      foundCourse.studentsCount++;
      await foundCourse.save();

      const data = this.prepareResponse(foundCourse);

      return {
        statusCode: 200,
        message: SuccessStudentEdited.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  public async removeStudent(courseId: string): Promise<CourseData> {
    try {
      const foundCourse = await database.Course.findOne({
        where: {
          id: courseId,
        },
      });

      if (foundCourse === null) {
        return DatabaseIssues.CourseNotFound;
      }

      if (foundCourse.studentsCount > 0) {
        foundCourse.studentsCount--;
      }

      await foundCourse.save();

      const data = this.prepareResponse(foundCourse);

      return {
        statusCode: 200,
        message: SuccessStudentEdited.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  private prepareResponse(course: ICourse): ISafeCourseData {
    const data: ISafeCourseData = {
      id: course.id,
      name: course.name,
      description: course.description,
      studentCount: course.studentsCount,
      author: course.author,
    };

    return data;
  }
}
