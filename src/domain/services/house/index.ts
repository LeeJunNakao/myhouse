import { HouseService } from './house';
import { HouseRepository } from '../../../database/repositories/house-repo';
import { HouseService as IHouseService } from '../../protocols/services';

export const mountHouseService = (): IHouseService => {
  const repo = new HouseRepository();
  return new HouseService(repo);
};
