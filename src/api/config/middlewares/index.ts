import { Express } from 'express';
import { bodyParser } from './body-parser/body-parser';
import { contentType } from './content-type/content-type';
import { cors } from './cors/cors';
import { auth } from './auth/auth';

export const setupMiddleware = (app: Express): void => {
  app.use(bodyParser);
  app.use(contentType);
  app.use(cors);
  app.use(auth);
};
