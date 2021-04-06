import { Express } from 'express';
import houseRouter from './house/house';
import purchaseRouter from './purchase/purchase';

export const registerRoutes = (app: Express): void => {
  app.use('/house', houseRouter);
  app.use('/house/:houseId/purchase', purchaseRouter);
};
