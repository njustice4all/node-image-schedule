import { Express } from 'express';

import eventRoute from './event/event.route';
import uploadRoute from './upload/upload.route';

export default (app: Express) => {
  app.use('/status', (req, res) => {
    return res.status(200).json({ status: 'OK' });
  });
  app.use('/event', eventRoute);
  app.use('/upload', uploadRoute);
};
