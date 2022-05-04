import database from '../db_models';
import { ICourse } from '../db_models/Course';
import {
  CourseAlreadyExist,
  CourseCreateBadRequest,
  CourseNotFound,
  ServerError,
} from '../output/errors';
import {
  SuccessCourseCreated,
  SuccessCourseDelete,
  SuccessCourseGet,
  SuccessCourseUpdate,
} from '../output/success';
import { ISafeCourseData } from '../typings';

interface CourseData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: object;
}

export default class CourseService {
  constructor(
    public name?: string,
    public description?: string,
    public author?: string
  ) {}

  public async create(): Promise<CourseData> {
    try {
      if (
        this.name === undefined &&
        this.description === undefined &&
        this.author === undefined
      ) {
        return CourseCreateBadRequest;
      }

      const foundCourse = await database.Course.findOne({
        where: { author: this.author, name: this.name },
      });

      if (foundCourse !== null) {
        return CourseAlreadyExist;
      }

      const createdCourse = await database.Course.create({
        name: this.name,
        description: this.description,
        author: this.author,
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
      return ServerError;
    }
  }

  public async update(id: string): Promise<CourseData> {
    try {
      const foundCourse = await database.Course.findOne({
        where: {
          id: id,
        },
      });

      if (foundCourse === null) {
        return CourseNotFound;
      }

      if (this.name !== undefined) {
        foundCourse.name = this.name;
      }

      if (this.description !== undefined) {
        foundCourse.description = this.description;
      }
      foundCourse.save();

      const data = this.prepareResponse(foundCourse);
      return {
        statusCode: 200,
        message: SuccessCourseUpdate.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  public async get(id: string): Promise<CourseData> {
    try {
      const foundCourse = await database.Course.findOne({
        where: {
          id: id,
        },
      });

      if (foundCourse === null) {
        return CourseNotFound;
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
      return ServerError;
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
        return CourseNotFound;
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
      return ServerError;
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
        return CourseNotFound;
      }

      foundCourse.destroy();
      return {
        statusCode: 200,
        message: SuccessCourseDelete.message,
        success: true,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  public async addStudent(id: string): Promise<CourseData> {
    try {
      const foundCourse = await database.Course.findOne({
        where: {
          id: id,
        },
      });

      if (foundCourse === null) {
        return CourseNotFound;
      }

      foundCourse.studentCount++;
      foundCourse.save();

      const data = this.prepareResponse(foundCourse);

      return {
        statusCode: 200,
        message: SuccessCourseDelete.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  private prepareResponse(course: ICourse): ISafeCourseData {
    const data: ISafeCourseData = {
      id: course.id,
      name: course.name,
      description: course.description,
      studentCount: course.studentCount,
      author: course.author,
    };

    return data;
  }
}
