import { CreateHouseDto, House } from '../House';

export interface HouseService {
  createHouse: (house: CreateHouseDto) => Promise<House>,
  getHouseByMemberId: (memberId: number | string) => Promise<House[]>,
  updateHouse: (house: House) => Promise<House>,
  deleteHouse: (id: string | number) => Promise<void>,
}
