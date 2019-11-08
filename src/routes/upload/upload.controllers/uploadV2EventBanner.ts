import { Request, Response } from 'express';
import { promises as fs } from 'fs';

import config from '../../../config';
import { DIR } from '../../../config/constants';
import { s3, checkFiles, blurImage as bufferToBlurImage } from '../../../utils';
import Scheduler from '../../../utils/scheduler';

interface UploadParam {
  Bucket: string;
  ACL: string;
  Key: string;
  Body: Buffer;
}

const BUCKET = config.BUCKET;

const uploadV2EventBanner = async (req: Request, res: Response) => {
  // validate param
  if (!req.file) return res.status(400).json({ success: false });

  // validate local file (temp-schedule)
  const hasSchedule = await checkFiles();
  if (hasSchedule) {
    return res.status(412).json({ success: false, msg: 'upload is already scheduled' });
  }

  // write files
  await writeTemp(req, res);

  // register schedule
  try {
    const scheduler = new Scheduler();
    scheduler.doSchedule(req.body.eventDate, initSchedule);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false });
  }
};

// TODO: 예외처리
export async function initSchedule(): Promise<string[]> {
  const tempFiles = await fs.readdir(`${DIR}/`);
  const filterFiles = tempFiles.filter(file => file !== '.DS_Store');
  const makeUploadParams = filterFiles.map(file => {
    return new Promise<UploadParam>((resolve, reject) =>
      fs
        .readFile(`${DIR}/${file}`)
        .then(buffer =>
          resolve({ Bucket: `${BUCKET}/event`, ACL: 'public-read', Key: file, Body: buffer })
        )
        .catch(err => reject(err))
    );
  });

  const params = await Promise.all(makeUploadParams);

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

  const results = await Promise.all(uploadPromises);

  await removeTempFiles();

  return results;
}

// 예약된 스케줄 관련 파일 생성
export async function writeTemp(req: Request, res: Response) {
  try {
    await fs.writeFile(`${DIR}/${req.file.originalname}`, req.file.buffer);
    await fs.writeFile(
      `${DIR}/eventUrl.json`,
      JSON.stringify({ ...req.body, eventImage: req.file.originalname })
    );
    const blurImage = await bufferToBlurImage(req.file.buffer);
    await fs.writeFile(`${DIR}/image-blur.png`, blurImage);
  } catch (error) {
    return res.status(400).json({ success: false, msg: 'write fail' });
  }
}

// temp-schedule 파일 제거
export async function removeTempFiles() {
  try {
    const tempFiles = await fs.readdir(`${DIR}/`);
    const filterFiles = tempFiles.filter(file => file !== '.DS_Store');
    const removeFiles = filterFiles.map(file => {
      return new Promise<boolean>((resolve, reject) => {
        fs.unlink(`${DIR}/${file}`)
          .then(() => resolve(true))
          .catch(() => reject(false));
      });
    });

    await Promise.all(removeFiles);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default uploadV2EventBanner;
