import { Router } from 'express';

import uploadCommonImage from './upload.controllers/uploadCommonImage';
import uploadV2EventBanner from './upload.controllers/uploadV2EventBanner';
import uploadResetSchedule from './upload.controllers/uploadResetSchedule';

const routes = Router();

routes.post('/', uploadV2EventBanner);

routes.post('/reset', uploadResetSchedule);

routes.post('/:type', uploadCommonImage);

export default routes;
