import { CreateHouseDto, House } from '../House';

export interface HouseService {
  createHouse: (house: CreateHouseDto) => Promise<House>,
}
