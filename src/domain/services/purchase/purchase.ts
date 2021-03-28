import { CreatePurchaseDto, Purchase, UpdatePurchaseDto } from '../../Purchase';

export interface PurchaseService {
  create: (dto: CreatePurchaseDto) => Promise<Purchase>,
  get: (userId: String | Number, houseId: String | Number) => Promise<Purchase[]>,
  update: (dto: UpdatePurchaseDto) => Promise<Purchase>,
  delete: (userId: String | Number, houseId: String | Number) => Promise<void>,
}
