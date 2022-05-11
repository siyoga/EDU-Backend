import { UploadedFile } from 'express-fileupload';
import { destinationPath } from '../../config';
import database from '../db_models';
import { IVideo } from '../db_models/Video';
import {
  ServerError,
  VideoAlreadyExist,
  VideoCannotBeUpload,
  VideoIsNotExist,
} from '../output/errors';
import { SuccessVideoGet, SuccessVideoUpload } from '../output/success';
import { ISafeVideoData } from '../typings';

interface VideoData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: ISafeVideoData;
}

export default class VideoService {
  public async upload(
    file: UploadedFile,
    courseId: string,
    lessonNumber: number
  ): Promise<VideoData> {
    try {
      const existVideo = await database.Video.findOne({
        where: {
          name: file.name,
        },
      });

      if (existVideo !== null) {
        return VideoAlreadyExist;
      }

      const path = `${destinationPath}/videos/${file.name}`;

      file.mv(path, (err) => {
        if (err) {
          return VideoCannotBeUpload;
        }
      });

      const newVideo = await database.Video.create({
        name: file.name,
        path: path,
        lessonNumber: lessonNumber,
        courseId: courseId,
      });

      const data = this.prepareResponse(newVideo);

      return {
        statusCode: 200,
        message: SuccessVideoUpload.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  public async get(courseId: string, lessonNumber: number): Promise<VideoData> {
    try {
      const existVideo = await database.Video.findOne({
        where: {
          courseId: courseId,
          lessonNumber: lessonNumber,
        },
      });

      if (existVideo === null) {
        return VideoIsNotExist;
      }

      const data = this.prepareResponse(existVideo);

      return {
        statusCode: 200,
        message: SuccessVideoGet.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerError;
    }
  }

  private prepareResponse(video: IVideo): ISafeVideoData {
    const data: ISafeVideoData = {
      name: video.name,
      path: video.path,
      lessonNumber: video.lessonNumber,
      courseId: video.courseId,
    };

    return data;
  }
}
