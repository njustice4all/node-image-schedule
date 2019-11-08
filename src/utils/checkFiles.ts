import 'express';
import { promises } from 'fs';

import { DIR } from '../config/constants';

// temp 디렉토리의 파일유무 검사
export default async function checkFiles() {
  const files = await promises.readdir(`${DIR}/`);
  const results = files.filter(file => file !== '.DS_Store');
  return results.length > 0;
}
