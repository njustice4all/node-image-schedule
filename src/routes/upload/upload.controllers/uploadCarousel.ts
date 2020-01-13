import { Request, Response } from 'express';

import config from '../../../config';
import { s3 } from '../../../utils';

const BUCKET = config.BUCKET;

interface UploadParam {
  Bucket: string;
  ACL: string;
  Key: string;
  Body: Buffer;
}

interface IBody {
  email: string;
  delay: string;
  names: string[];
  images: any[];
}

const uploadCarousel = async (req: Request, res: Response) => {
  const { email, delay, names }: IBody = req.body;

  const images = names.map(data => {
    const { name, url } = JSON.parse(data);
    return { name, url };
  });

  try {
    // @ts-ignore: Unreachable code error
    const makeUploadParams = req.files.map((file: Express.Multer.File) => {
      return new Promise<UploadParam>((resolve, reject) =>
        resolve({
          Bucket: `${BUCKET}/carousel`,
          ACL: 'public-read',
          Key: file.originalname,
          Body: file.buffer,
        })
      );
    });
    makeUploadParams.push(
      new Promise(resolve =>
        resolve({
          Bucket: `${BUCKET}/carousel`,
          ACL: 'public-read',
          Key: 'carousel.json',
          Body: Buffer.from(JSON.stringify({ email, delay, images }), 'utf8'),
        })
      )
    );
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
  } catch (error) {
    return res.status(400).json({ success: false, msg: '망함' });
  }

  res.status(200).json({ success: true });
};

export default uploadCarousel;
