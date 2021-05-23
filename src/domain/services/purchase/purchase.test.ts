import { PurchaseRepository } from '../../../database/repositories/purchase/purchase-repo';
import { mountHouseService } from '../index';
import { PurchaseService } from './purchase';
import { HouseService } from '../house/house';
import { truncateDatabase } from '../../../database/helpers/query-helper';

const userId = 9;

const house = {
  userId,
  name: 'Casa de praia',
  members: [userId, 25],
};

const purchase = {
  userId,
  date: 1617388109773,
  description: 'Mercado',
  value: 7500,
};

interface SutTypes {
  sut: PurchaseService,
  houseSut: HouseService,
}

const makeSut = (): SutTypes => {
  const repo = new PurchaseRepository();
  const sut = new PurchaseService(repo);
  const houseSut = mountHouseService();
  return { sut, houseSut };
};

describe('Purchase service - Integration', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should create correctly', async() => {
    const { sut, houseSut } = makeSut();
    const createdHouse = await houseSut.createHouse(house);
    const createdPurchase = await sut.create({ ...purchase, houseId: createdHouse.id });
    expect({ ...purchase, id: createdPurchase.id, houseId: createdHouse.id }).toEqual(createdPurchase);
  });

  test('Should get correctly', async() => {
    const { sut, houseSut } = makeSut();
    const { id: houseId } = await houseSut.createHouse(house);
    const createdPurchase = await sut.create({ ...purchase, houseId });
    const foundPurchase = await sut.get(userId, houseId);
    expect(foundPurchase).toEqual([createdPurchase]);
  });

  test('Should update correctly', async() => {
    const updateDto = {
      ...purchase,
      userId,
      date: 1617388105743,
      description: 'Posto',
      value: 8900,
    };

    const { sut, houseSut } = makeSut();
    const { id: houseId } = await houseSut.createHouse(house);
    const createdPurchase = await sut.create({ ...purchase, houseId });
    const updatedPurchase = await sut.update({ ...createdPurchase, ...updateDto });
    expect(updatedPurchase).toEqual({ ...createdPurchase, ...updateDto, date: String(updateDto.date) });
  });
});
