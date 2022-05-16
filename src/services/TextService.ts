import database from '../db_models';

import { UploadedFile } from 'express-fileupload';
import { destinationPath } from '../../config';
import { IText } from '../db_models/Text';
import { ServerIssues, DatabaseIssues } from '../output/errors';
import {
  SuccessTextDelete,
  SuccessTextGet,
  SuccessTextUpdate,
  SuccessTextUpload,
} from '../output/success';
import { ISafeTextData } from '../typings';

interface TextData {
  statusCode: number;
  message: string;
  success: boolean;
  data?: ISafeTextData;
}

export default class TextService {
    public async upload(
        file: UploadedFile,
        courseId: string,
        textName: string,
        lessonNumber: number
    ): Promise<TextData> {
        try {
            const existText = await database.Text.findOne({
                where: {
                  name: textName,
                }, 
        });

        if (existText !== null) {
            return DatabaseIssues.TextAlreadyExist
        }

        const path = `${destinationPath}/texts/${file.name}`;

        file.mv(path, (err) => {
            if (err) {
              return DatabaseIssues.TextCannotBeUpload;
            }
        });

        const newText = await database.Text.create({
            name: textName,
            path: path,
            lessonNumber: lessonNumber,
            courseId: courseId,
        });

        const data = this.prepareResponse(newText);

        return {
            statusCode: 200,
            message: SuccessTextUpload.message,
            success: true,
            data: data,
        };
    } catch (e) {
        console.log(e);
        return ServerIssues.ServerError;
      }
    }

    public async get(courseId: string, lessonNumber: number): Promise<TextData> {
        try {
          const existText = await database.Text.findOne({
            where: {
              courseId: courseId,
              lessonNumber: lessonNumber,
            },
          });
    
          if (existText === null) {
            return DatabaseIssues.TextIsNotExist;
          }
    
          const data = this.prepareResponse(existText);
    
          return {
            statusCode: 200,
            message: SuccessTextGet.message,
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
      ): Promise<TextData> {
        try {
          const existText = await database.Text.findOne({
            where: {
              courseId: courseId,
              lessonNumber: lessonNumber,
            },
          });
    
          if (existText === null) {
            return DatabaseIssues.TextIsNotExist;
          }
    
          const data = this.prepareResponse(existText);
          await existText.destroy();
          return {
            statusCode: 200,
            message: SuccessTextDelete.message,
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
      ): Promise<TextData> {
        try {
          const existText = await database.Text.findOne({
            where: {
              courseId: courseId,
              lessonNumber: lessonNumber,
            },
          });
    
          if (existText === null) {
            return DatabaseIssues.TextIsNotExist;
          }
    
          if (newLessonNumber !== undefined) {
            const textByNewLessonNumber = (await database.Text.findOne({
              where: {
                courseId: courseId,
                lessonNumber: lessonNumber,
              },
            })) as IText;
    
            textByNewLessonNumber.lessonNumber = lessonNumber;
            existText.lessonNumber = newLessonNumber;
    
            await textByNewLessonNumber.save();
          }
    
          if (newName !== undefined) {
            const textByNewName = await database.Text.findOne({
              where: {
                courseId: courseId,
                name: newName,
              },
            });
    
            if (textByNewName !== null) {
              return DatabaseIssues.TextAlreadyExist;
            }
    
            existText.name = newName;
          }
    
          await existText.save();
          const data = this.prepareResponse(existText);
    
          return {
            statusCode: 200,
            message: SuccessTextUpdate.message,
            success: true,
            data: data,
          };
        } catch (e) {
          console.log(e);
          return ServerIssues.ServerError;
        }
    }

    private prepareResponse(text: IText): ISafeTextData {
        const data: ISafeTextData = {
          name: text.name,
          path: text.path,
          lessonNumber: text.lessonNumber,
          courseId: text.courseId,
        };
    
        return data;
    }
}