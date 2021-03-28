import { House } from './House';

export interface Purchase {
  id: Number | String,
  userId: Number | String,
  houseId: House['id'],
  date: Date,
  description: String,
  value: Number,
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
