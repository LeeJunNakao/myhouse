import { HouseController } from './house';
import { mountHouseService } from '../../../domain/services';
import Controller from '../GenericController';

export const mountHouse = (): Controller => {
  const service = mountHouseService();
  return new HouseController(service);
};
