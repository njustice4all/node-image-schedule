import { Router } from 'express';
import multer from 'multer';

import uploadCommonImage from './upload.controllers/uploadCommonImage';
import uploadV2EventBanner from './upload.controllers/uploadV2EventBanner';
import uploadResetSchedule from './upload.controllers/uploadResetSchedule';
import uploadCarousel from './upload.controllers/uploadCarousel';

const imageMiddleware = multer().single('image');

const routes = Router();

routes.post('/', imageMiddleware, uploadV2EventBanner);

// routes.post('/carousel', multer().single('images'), uploadCarousel);
routes.post('/carousel', multer().array('images', 4), uploadCarousel);

routes.post('/reset', imageMiddleware, uploadResetSchedule);

routes.post('/:type', imageMiddleware, uploadCommonImage);

export default routes;
