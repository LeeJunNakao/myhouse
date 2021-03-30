import { HouseService } from './house/house';
import { HouseRepository } from '../../database/repositories';
import { HouseService as IHouseService } from '../protocols/services';

export const mountHouseService = (): IHouseService => {
  const repo = new HouseRepository();
  return new HouseService(repo);
};
