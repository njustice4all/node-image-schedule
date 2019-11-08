import S3 from 'aws-sdk/clients/s3';

import config from '../config';
import blurImage from './blurImage';
import checkFiles from './checkFiles';
import Logger, { LoggerMiddleware } from './logger';
import { sendNotification } from './notification';

const accessKeyId = config.ACCESSKEYID;
const secretAccessKey = config.SECRETACCESSKEY;

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  region: 'ap-northeast-2',
});

export { s3, blurImage, Logger, LoggerMiddleware, checkFiles, sendNotification };
