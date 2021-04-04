import { HouseService } from './house/house';
import { HouseRepository, PurchaseRepository } from '../../database/repositories';
import { PurchaseService } from './purchase';

export const mountHouseService = (): HouseService => {
  const repo = new HouseRepository();
  return new HouseService(repo);
};

export const mountPurchaseService = (): PurchaseService => {
  const repo = new PurchaseRepository();
  return new PurchaseService(repo);
};
