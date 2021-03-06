import { House } from './House';

export interface Purchase {
  id: number | string,
  userId: number | string,
  houseId: House['id'],
  date: number,
  description: string,
  value: number,
}

export interface CreatePurchaseDto {
  userId: Purchase['userId'],
  houseId: Purchase['houseId'],
  date: Purchase['date'],
  description: Purchase['description'],
  value: Purchase['value'],
}

export interface UpdatePurchaseDto {
  id: Purchase['id'],
  userId: Purchase['userId'],
  date: Purchase['date'],
  description: Purchase['description'],
  value: Purchase['value'],
}
