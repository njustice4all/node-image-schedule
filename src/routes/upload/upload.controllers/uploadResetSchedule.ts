import { Request, Response } from 'express';

import { writeTemp, removeTempFiles, initSchedule } from './uploadV2EventBanner';
import Scheduler from '../../../utils/scheduler';

const uploadResetSchedule = async (req: Request, res: Response) => {
  // TODO: job이 없을때 cancel 예외처리
  Scheduler.cancel();

  await removeTempFiles();
  await writeTemp(req, res);

  try {
    Scheduler.doSchedule(req.body.eventDate, initSchedule);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false });
  }
};

export default uploadResetSchedule;
