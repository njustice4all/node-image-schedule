import 'express';
import { promises as fs } from 'fs';

import { DIR } from '../config/constants';
import checkFiles from './checkFiles';
import { initSchedule } from '../routes/upload/upload.controllers/uploadV2EventBanner';
import Scheduler from './scheduler';

export const initialize = async () => {
  const hasSchedule = await checkFiles();

  // temp-schedule에 파일이 없으면 스케쥴이 없음
  if (!hasSchedule) return;

  try {
    const eventInfo = await fs.readFile(`${DIR}/eventUrl.json`, 'utf8');
    const { eventDate } = JSON.parse(eventInfo);

    Scheduler.doSchedule(eventDate, initSchedule);
  } catch (error) {
    console.error(error);
  }
};
