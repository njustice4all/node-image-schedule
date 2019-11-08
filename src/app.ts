import express from 'express';

import config from './config';
import useMiddleware from './middleware';
import routes from './routes';
import { initialize } from './utils/initialize';

const app = express();

useMiddleware(app);

routes(app);

initialize();

app.listen(Number(config.PORT), err => {
  if (err) {
    throw err;
  }

  console.log(`port: ${config.PORT} 😄`);
  console.log(`environment: ${config.ENV} 🌴`);
});
