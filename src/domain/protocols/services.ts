import { CreateHouseDto, House } from '../House';

export interface HouseService {
  createHouse: (house: CreateHouseDto) => Promise<House>,
  getHouseByMemberId: (house: House) => Promise<House[]>,
  updateHouse: (house: House) => Promise<House>,
}
