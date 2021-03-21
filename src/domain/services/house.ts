import { HouseService as IHouseService } from '../protocols/services';
import { CreateHouseDto, House } from '../House';
import { HouseRepository } from '../../database/protocols';

export class HouseService implements IHouseService {
  private readonly repo: HouseRepository;

  constructor(repo: HouseRepository) {
    this.repo = repo;
  }

  async createHouse(house: CreateHouseDto): Promise<House> {
    const result = await this.repo.create(house);
    return result;
  }

  async getHouseByMemberId(memberId: number | string): Promise<House[]> {
    const result = await this.repo.get(memberId);
    return result;
  }

  async updateHouse(house: House): Promise<House> {
    const result = await this.repo.update(house);
    return result;
  }
}
