import { HouseService } from './house/house';
import { HouseRepository } from '../../database/repositories';

export const mountHouseService = (): HouseService => {
  const repo = new HouseRepository();
  return new HouseService(repo);
};
