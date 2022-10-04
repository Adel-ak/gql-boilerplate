import Upload from 'graphql-upload/Upload.mjs';

export interface IAwsUpload {
  file: Upload;
  fileName?: string;
  path?: string;
  ACL?:
    | 'private'
    | 'public-read'
    | 'public-read-write'
    | 'aws-exec-read'
    | 'authenticated-read'
    | 'bucket-owner-read'
    | 'bucket-owner-full-control'
    | 'log-delivery-write';
}

export enum EValidFileMimeType {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
}

export enum EValidFileExtension {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
}
