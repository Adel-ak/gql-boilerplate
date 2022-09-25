import { S3 } from 'aws-sdk';
import fs, { ReadStream } from 'fs';
import { Injectable, Scope } from 'graphql-modules';
import path from 'path';
import { finished } from 'stream/promises';
import { Env } from '../../config/env.js';
import { GoResponse, ReqError, TAwsUpload } from '../../shared/types/index.js';
import { Logger } from '../../utils/logger.js';

type TUploadRes = GoResponse<S3.ManagedUpload.SendData, ReqError>;

@Injectable({ scope: Scope.Singleton, global: true })
export class AwsProvider {
  private log = new Logger(AwsProvider.name);

  upload = async (args: TAwsUpload): TUploadRes => {
    const {
      file: { file },
      fileName,
      path = '',
      ACL = 'public-read',
    } = args;
    const { AWS_S3_BUCKET, IS_DEV } = Env;
    const { filename, createReadStream } = file!;
    const stream = createReadStream();
    const ext = filename.substring(filename.lastIndexOf('.'), filename.length);
    const _fileName = fileName ? `${fileName}${ext}` : filename;
    const filePath = `${path}`;

    if (IS_DEV) {
      return await this.localUpload(stream, filePath, _fileName);
    } else {
      return await this.uploadS3(stream, AWS_S3_BUCKET!, filePath, _fileName, ACL);
    }
  };

  private uploadS3 = async (
    file: ReadStream,
    bucket: string,
    filePath: string,
    fileName: string,
    ACL: string,
  ): TUploadRes => {
    const s3 = this.getS3();
    const path = `${filePath}/${fileName}`.replace(/\s+/g, '-').toLowerCase();
    const params: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: path,
      Body: file,
      ACL,
    };
    return await new Promise(async (res) => {
      s3.upload(params, (err, data) => {
        if (err) {
          this.log.error(err);
          res([
            null,
            new ReqError({
              message: 'Failed to upload file to s3',
              stack: err,
            }),
          ]);
        }
        res([
          {
            ...data,
            Location: path,
          },
          null,
        ]);
      });
    });
  };

  private getS3 = () => {
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = Env;

    return new S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
  };

  private localUpload = async (file: ReadStream, filePath: string, fileName: string): TUploadRes => {
    try {
      const imagePath = `${filePath}/${fileName}`;
      const folder = path.resolve('uploads/', filePath);
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      const out = fs.createWriteStream(`${folder}/${fileName}`);

      file.pipe(out);
      await finished(out);

      return [
        {
          Location: imagePath,
          Bucket: '',
          ETag: '',
          Key: '',
        },
        null,
      ];
    } catch (err) {
      this.log.error(err);
      return [
        null,
        new ReqError({
          message: 'Failed to save file uploaded file',
          stack: err,
        }),
      ];
    }
  };
}
