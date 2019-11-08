import { Router } from 'express';

import { getEvent } from './event.controller';

const routes = Router();

routes.get('/', getEvent);

export default routes;
