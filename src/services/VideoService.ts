import database from '../db_models';
import fs from 'fs';

import { UploadedFile } from 'express-fileupload';
import { destinationPath } from '../../config';
import { IVideo } from '../db_models/Video';
import { ServerIssues, DatabaseIssues } from '../output/errors';
import {
  SuccessVideoDelete,
  SuccessVideoGet,
  SuccessVideoUpdate,
  SuccessVideoUpload,
} from '../output/success';
import { ISafeVideoData } from '../typings';

interface VideoData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: ISafeVideoData | ISafeVideoData[];
}

export default class VideoService {
  public async upload(
    file: UploadedFile,
    courseId: string,
    videoName: string,
    lessonNumber: number
  ): Promise<VideoData> {
    try {
      const existVideo = await database.Video.findOne({
        where: {
          name: videoName,
        },
      });

      if (existVideo !== null) {
        return DatabaseIssues.VideoAlreadyExist;
      }

      let path = `${destinationPath}/videos/`;

      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }

      path = `${destinationPath}/videos/${file.name}`;

      file.mv(path, (e) => {
        if (e) {
          return DatabaseIssues.FileCannotBeUpload;
        }
      });

      const newVideo = await database.Video.create({
        name: videoName,
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
      return ServerIssues.ServerError;
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
        return DatabaseIssues.VideoIsNotExist;
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
      return ServerIssues.ServerError;
    }
  }

  public async getAll(courseId: string): Promise<VideoData> {
    try {
      const existVideos = await database.Video.findAll({
        where: {
          cousrseId: courseId,
        },
      });

      if (existVideos === null) {
        return DatabaseIssues.VideoIsNotExist;
      }

      const data: ISafeVideoData[] = [];

      existVideos.forEach((element) => {
        const videoData = this.prepareResponse(element);
        data.push(videoData);
      });

      return {
        statusCode: 200,
        message: SuccessVideoGet.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
    }
  }

  public async delete(
    courseId: string,
    lessonNumber: number
  ): Promise<VideoData> {
    try {
      const existVideo = await database.Video.findOne({
        where: {
          courseId: courseId,
          lessonNumber: lessonNumber,
        },
      });

      if (existVideo === null) {
        return DatabaseIssues.VideoIsNotExist;
      }

      const data = this.prepareResponse(existVideo);
      await existVideo.destroy();
      return {
        statusCode: 200,
        message: SuccessVideoDelete.message,
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
    lessonNumber: number,
    newLessonNumber?: number,
    newName?: string
  ): Promise<VideoData> {
    try {
      const existVideo = await database.Video.findOne({
        where: {
          courseId: courseId,
          lessonNumber: lessonNumber,
        },
      });

      if (existVideo === null) {
        return DatabaseIssues.VideoIsNotExist;
      }

      if (newLessonNumber !== undefined) {
        const videobyNewLessonNumber = (await database.Video.findOne({
          where: {
            courseId: courseId,
            lessonNumber: lessonNumber,
          },
        })) as IVideo;

        videobyNewLessonNumber.lessonNumber = lessonNumber;
        existVideo.lessonNumber = newLessonNumber;

        await videobyNewLessonNumber.save();
      }

      if (newName !== undefined) {
        const videoByNewName = await database.Video.findOne({
          where: {
            courseId: courseId,
            name: newName,
          },
        });

        if (videoByNewName !== null) {
          return DatabaseIssues.VideoAlreadyExist;
        }

        existVideo.name = newName;
      }

      await existVideo.save();
      const data = this.prepareResponse(existVideo);

      return {
        statusCode: 200,
        message: SuccessVideoUpdate.message,
        success: true,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return ServerIssues.ServerError;
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
