import { CreateHouseDto, House } from '../domain/House';

export interface HouseRepository {
  create: (dto: CreateHouseDto) => Promise<House>,
  get: (userId: number | string) => Promise<House[]>,
  updateName: (dto: House) => Promise<House>,
  update: (dto: House) => Promise<House>,
  delete: (id: string | number, userId: string | number) => Promise<void>,
}
