import { NextFunction, Response, Request } from 'express';
import winston, { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { format as dateFnsFormat } from 'date-fns';
import multer from 'multer';

function customFormat() {
  return format.printf(info => {
    console.log(info.message);
    return `${dateFnsFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')} ${info.message}`;
  });
}

const Logger = winston.createLogger({
  format: customFormat(),
  transports: [
    new DailyRotateFile({
      filename: './log/s3-upload.log', // 로그파일
      zippedArchive: true, // 압축
      maxFiles: '14d', // 보관일수
    }),
  ],
});

export const LoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let email = 'unknown';
  if (req.body.email) {
    email = req.body.email;
  }

  Logger.info(`REQUEST ${req.method} ${req.url} email: ${email}`);
  next();
};

export default Logger;
