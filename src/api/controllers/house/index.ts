import { HouseController } from './house';
import { mountHouseService } from '../../../domain/services';

export const mountHouse = (): HouseController => {
  const service = mountHouseService();
  return new HouseController(service);
};
