import { House } from './House';

export interface Purchase {
  id: Number | String,
  member: Number | String,
  houseId: House['id'],
  date: Date,
  description: String,
  value: Number,
}
