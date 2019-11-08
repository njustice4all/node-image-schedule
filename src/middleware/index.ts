import express, { Express } from 'express';
import cors from 'cors';
import multer from 'multer';

import { LoggerMiddleware } from '../utils';

const imageMiddleware = multer().single('image');

export default (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(imageMiddleware);
  app.use(LoggerMiddleware);
};
