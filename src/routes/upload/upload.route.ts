import { Router } from 'express';
import multer from 'multer';

import uploadCommonImage from './upload.controllers/uploadCommonImage';
import uploadV2EventBanner from './upload.controllers/uploadV2EventBanner';
import uploadResetSchedule from './upload.controllers/uploadResetSchedule';
import uploadCarousel from './upload.controllers/uploadCarousel';
import uploadV2Image from './upload.controllers/uploadV2Image';

const imageMiddleware = multer().single('image');

const routes = Router();

routes.post('/', imageMiddleware, uploadV2EventBanner);

routes.post('/carousel', multer().array('images'), uploadCarousel);

routes.post('/reset', imageMiddleware, uploadResetSchedule);

routes.post('/common', multer().array('images'), uploadCommonImage);

routes.post('/v2', multer().array('images'), uploadV2Image);

export default routes;
