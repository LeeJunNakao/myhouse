import { PurchaseService as IPurchaseService } from '../../protocols/services';
import { CreatePurchaseDto, Purchase, UpdatePurchaseDto } from '../../Purchase';
import { PurchaseRepository } from '../../../database/protocols';

export class PurchaseService implements IPurchaseService {
  private readonly repo: PurchaseRepository;

  constructor(repo: PurchaseRepository) {
    this.repo = repo;
  }

  async create(dto: CreatePurchaseDto): Promise<Purchase> {
    return await this.repo.create(dto);
  }

  async get(userId: string | number, houseId: string | number): Promise<Purchase[]> {
    return await this.repo.get(userId, houseId);
  }

  async update(dto: UpdatePurchaseDto): Promise<Purchase> {
    return await this.repo.update(dto);
  }

  async delete(id: string | number, userId: string | number): Promise<void> {
    await this.repo.delete(id, userId);
  }
}
