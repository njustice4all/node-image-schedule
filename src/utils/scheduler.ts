import schedule, { Job } from 'node-schedule';

import Logger from './logger';
import { sendNotification } from './notification';

class Scheduler {
  private job: Job;
  private doDate: string;
  private callback: () => Promise<string[]>;

  doSchedule(doDate: string, callback: () => Promise<string[]>) {
    this.doDate = doDate;
    this.callback = callback;

    this.job = schedule.scheduleJob(this.doDate, async (date: Date) => {
      console.log(date.toLocaleString(), 'job done🤡');
      const uploadResults = await this.callback();
      let text = '';
      uploadResults.forEach((result) => {
        text += `• ${result} \n`;
        Logger.info(`upload success👏 ${result}`);
      });
      await sendNotification(text);
    });
  }

  cancel() {
    this.job.cancel();
  }
}

export default new Scheduler();
