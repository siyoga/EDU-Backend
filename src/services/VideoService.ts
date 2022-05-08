import { UploadedFile } from 'express-fileupload';
import { destinationPath } from '../../config';
import database from '../db_models';
import { IVideo } from '../db_models/Video';
import {
  FilesNotProvided,
  RequireFieldNotProvided,
  ServerError,
  VideoAlreadyExist,
  VideoCannotBeUpload,
} from '../output/errors';
import { SuccessVideoUpload } from '../output/success';
import { ISafeVideoData } from '../typings';

interface VideoData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: object;
}

export default class VideoService {
  constructor(public file?: UploadedFile) {}

  public async upload(courseId: string): Promise<VideoData> {
    try {
      if (this.file === undefined) {
        return FilesNotProvided;
      }

      const existVideo = await database.Video.findOne({
        where: {
          name: this.file.name,
        },
      });

      if (existVideo !== null) {
        return VideoAlreadyExist;
      }

      const path = `${destinationPath}/videos/${this.file.name}`;

      this.file.mv(path, (err) => {
        if (err) {
          return VideoCannotBeUpload;
        }
      });

      const newVideo = await database.Video.create({
        name: this.file!.name,
        path: path,
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

  private prepareResponse(video: IVideo): ISafeVideoData {
    const data: ISafeVideoData = {
      name: video.name,
      path: video.path,
      courseId: video.courseId,
    };

    return data;
  }
}
