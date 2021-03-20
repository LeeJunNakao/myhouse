import { HouseService as IHouseService} from '../protocols/services';
import { CreateHouseDto, House } from '../House';
import { HouseRepository } from '../../database/protocols';

export class HouseService implements IHouseService {
    private repo: HouseRepository;

    constructor(repo: HouseRepository) {
        this.repo = repo;
    }
    
    async createHouse(house: CreateHouseDto): Promise<House> {
        const result = await this.repo.create(house);
        return result;
    }
}