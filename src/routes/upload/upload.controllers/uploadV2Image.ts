import { Request, Response } from 'express';

import config from '../../../config';
import { s3, Logger } from '../../../utils';

const BUCKET = config.BUCKET;

interface UploadParam {
  Bucket: string;
  ACL: string;
  Key: string;
  Body: Buffer;
}

// TODO: 예외처리
const uploadV2Image = async (req: Request, res: Response) => {
  const { models, email } = req.body;

  const jsonModel = JSON.parse(models);

  try {
    if (req.files) {
      // @ts-ignore: Unreachable code error
      const makeUploadParams = req.files.map((file: Express.Multer.File) => {
        const [results] = jsonModel.filter(value => value.key === file.originalname);
        return new Promise<UploadParam>((resolve, reject) =>
          resolve({
            Bucket: `${BUCKET}/v2`,
            ACL: 'public-read',
            Key: results.fileName,
            Body: file.buffer,
          })
        );
      });
      const params: UploadParam[] = await Promise.all(makeUploadParams);
      const uploadPromises = params.map(param => {
        return new Promise<string>((resolve, reject) => {
          s3.upload({ ...param }, (err, data) => {
            if (err) {
              reject(err);
            }
            resolve(data.Location);
          });
        });
      });
      await Promise.all(uploadPromises);
    }

    s3.upload(
      {
        Bucket: `${BUCKET}/v2`,
        ACL: 'public-read',
        Key: 'v2model.json',
        Body: Buffer.from(models, 'utf8'),
      },
      (err, data) => {
        if (err) {
          return res.status(400).json({ success: false, msg: err.message });
        }

        Logger.info(`upload success👏 ${data.Location} email: ${email}`);
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {}
};

export default uploadV2Image;
