import { CreateHouseDto, House } from '../domain/House';

export interface HouseRepository {
    create(dto: CreateHouseDto): Promise<House>
}