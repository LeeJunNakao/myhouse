import { CreateHouseDto, House } from '../domain/House';
import { Purchase, CreatePurchaseDto, UpdatePurchaseDto } from '../domain/Purchase';

export interface HouseRepository {
  create: (dto: CreateHouseDto) => Promise<House>,
  get: (userId: number | string) => Promise<House[]>,
  updateName: (dto: House) => Promise<House>,
  update: (dto: House) => Promise<House>,
  delete: (id: string | number, userId: string | number) => Promise<void>,
}

export interface PurchaseRepository {
  create: (dto: CreatePurchaseDto) => Promise<Purchase>,
  get: (userId: number | string, houseId: number | string) => Promise<Purchase[]>,
  update: (dto: UpdatePurchaseDto) => Promise<Purchase>,
  delete: (id: string | number, userId: string | number) => Promise<void>,
}
