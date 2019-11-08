import { Request, Response } from 'express';

import config from '../../../config';
import { s3, Logger } from '../../../utils';

const BUCKET = config.BUCKET;

// TODO: 예외처리
const uploadCommonImage = (req: Request, res: Response) => {
  const { type } = req.params;
  const { buffer } = req.file;
  const { email } = req.body;

  s3.upload(
    {
      Bucket: `${BUCKET}/commonImage`,
      ACL: 'public-read',
      Key: `image-${type}.png`,
      Body: buffer,
    },
    (err, data) => {
      if (err) {
        return res.status(400).json({ success: false, msg: err.message });
      }

      Logger.info(`upload success👏 ${data.Location} email: ${email}`);
      return res.status(200).json({ success: true });
    }
  );
};

export default uploadCommonImage;
