import { Express } from 'express';
import houseRouter from './house/house';

export const registerRoutes = (app: Express): void => {
  app.use('/house', houseRouter);
};