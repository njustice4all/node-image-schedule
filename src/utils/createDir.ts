import 'express';
import fs from 'fs';

import { DIR } from '../config/constants';

export default () => {
  if (!fs.existsSync(`${DIR}/carousel`)) {
    fs.mkdirSync(`${DIR}/carousel`);
  }
};
