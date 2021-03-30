import { CreateHouseDto, House } from '../House';
import { CreatePurchaseDto, Purchase, UpdatePurchaseDto } from '../../domain/Purchase';

export interface HouseService {
  createHouse: (house: CreateHouseDto) => Promise<House>,
  getHouseByUserId: (userId: number | string) => Promise<House[]>,
  updateHouse: (house: House) => Promise<House>,
  deleteHouse: (id: string | number, userId: string | number) => Promise<void>,
}

export interface PurchaseService {
  create: (dto: CreatePurchaseDto) => Promise<Purchase>,
  get: (userId: string | number, houseId: string | number) => Promise<Purchase[]>,
  update: (dto: UpdatePurchaseDto) => Promise<Purchase>,
  delete: (id: string | number, userId: string | number) => Promise<void>,
}
