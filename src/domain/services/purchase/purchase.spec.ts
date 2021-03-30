import { PurchaseService } from './purchase';
import { PurchaseRepository as IPurchaseRepository } from '../../../database/protocols';
import { Purchase, CreatePurchaseDto, UpdatePurchaseDto } from '../../../domain/Purchase';

const purchase: Purchase = {
  id: 5,
  userId: 3,
  houseId: 77,
  date: Date.now(),
  description: 'Mercado Do Zé',
  value: 35000,
};

class PurchaseRepository implements IPurchaseRepository {
  async create(dto: CreatePurchaseDto): Promise<Purchase> {
    return await new Promise(resolve => resolve(purchase));
  }

  async get(userId: number | string, houseId: number | string): Promise<Purchase[]> {
    return await new Promise(resolve => resolve([purchase]));
  }

  async update(dto: UpdatePurchaseDto): Promise<Purchase> {
    return await new Promise(resolve => resolve({ ...purchase, ...dto, id: purchase.id, houseId: purchase.houseId }));
  }

  async delete(id: string | number, userId: string | number): Promise<void> {
    await new Promise(resolve => resolve(null));
  }
}

interface SutType {
  sut: PurchaseService,
  repoSut: PurchaseRepository,
}

const makeSut = (): SutType => {
  const repoSut = new PurchaseRepository();
  const sut = new PurchaseService(repoSut);
  return { sut, repoSut };
};

describe('Purchase service create - Unit', () => {
  const createPurchase = { ...purchase, id: undefined };

  test('Should call create with correct data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'create');
    await sut.create(createPurchase);
    expect(repoSpy).toHaveBeenCalledWith(createPurchase);
  });

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.create(createPurchase);
    await expect(promise).rejects.toThrow();
  });

  test('Should return purchase sucessfuly', async() => {
    const { sut } = makeSut();
    const createdPurchase = await sut.create(createPurchase);
    expect(createdPurchase).toEqual(purchase);
  });
});

describe('Purchase service get - Unit', () => {
  const { houseId, userId } = purchase;
  test('Should call create with correct data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'get');
    await sut.get(userId, houseId);
    expect(repoSpy).toHaveBeenCalledWith(userId, houseId);
  });

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.get(userId, houseId);
    await expect(promise).rejects.toThrow();
  });

  test('Should return purchase sucessfuly', async() => {
    const { sut } = makeSut();
    const createdPurchase = await sut.get(userId, houseId);
    expect(createdPurchase).toEqual([purchase]);
  });
});

describe('Purchase service update - Unit', () => {
  const updatePurchase = { ...purchase, houseId: undefined };

  test('Should call create with correct data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'update');
    await sut.update(updatePurchase);
    expect(repoSpy).toHaveBeenCalledWith(updatePurchase);
  });

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.update(updatePurchase);
    await expect(promise).rejects.toThrow();
  });

  test('Should return purchase sucessfuly', async() => {
    const { sut } = makeSut();
    const updatedPurchase = await sut.update(updatePurchase);
    expect(updatedPurchase).toEqual({ ...updatePurchase, houseId: purchase.houseId });
  });
});

describe('Purchase service delete - Unit', () => {
  const { id, userId } = purchase;

  test('Should call create with correct data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'delete');
    await sut.delete(id, userId);
    expect(repoSpy).toHaveBeenCalledWith(id, userId);
  });

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'delete').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.delete(id, userId);
    await expect(promise).rejects.toThrow();
  });
});
