import { House } from './House';

export interface Purchase {
  id: Number | String,
  userId: Number | String,
  houseId: House['id'],
  date: Date,
  description: String,
  value: Number,
}
