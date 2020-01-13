import express, { Express } from 'express';
import cors from 'cors';

import { LoggerMiddleware } from '../utils';

export default (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(LoggerMiddleware);
};
