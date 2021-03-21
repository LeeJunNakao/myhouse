import { CreateHouseDto, House } from "../domain/House";

export interface HouseRepository {
  create(dto: CreateHouseDto): Promise<House>;
  get(id: number | string): Promise<House[]>;
  update(dto: House): Promise<House>;
}
