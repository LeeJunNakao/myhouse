import { CreateHouseDto, House } from '../House';

export interface HouseService {
  createHouse: (house: CreateHouseDto) => Promise<House>,
  getHouseByUserId: (userId: number | string) => Promise<House[]>,
  updateHouse: (house: House) => Promise<House>,
  deleteHouse: (id: string | number, userId: string | number) => Promise<void>,
}
