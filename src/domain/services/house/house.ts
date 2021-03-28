import { HouseService as IHouseService } from '../../protocols/services';
import { CreateHouseDto, House } from '../../House';
import { HouseRepository } from '../../../database/protocols';

export class HouseService implements IHouseService {
  private readonly repo: HouseRepository;

  constructor(repo: HouseRepository) {
    this.repo = repo;
  }

  async createHouse(house: CreateHouseDto): Promise<House> {
    const result = await this.repo.create(house);
    return result;
  }

  async getHouseByUserId(userId: number | string): Promise<House[]> {
    const result = await this.repo.get(userId);
    return result;
  }

  async updateHouse(house: House): Promise<House> {
    const result = Array.isArray(house.members) && house.members.length ? await this.repo.update(house) : await this.repo.updateName(house);
    return result;
  }

  async deleteHouse(id: string | number, userId: string | number): Promise<void> {
    await this.repo.delete(id, userId);
  }
}
