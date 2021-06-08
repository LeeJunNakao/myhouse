import { PurchaseRepository } from './purchase-repo';
import { HouseRepository } from '../house/house-repo';
import { truncateDatabase } from '../../helpers/query-helper';

const userId = 9;

const house = {
  id: 1,
  userId,
  name: 'Minha Casa',
  members: [userId, 17],
};

const purchase = {
  id: 1,
  userId,
  houseId: house.id,
  date: 1617388109773,
  description: 'Mercado',
  value: 7500,
};

interface SutType {
  sut: PurchaseRepository,
  houseSut: HouseRepository,
}

const makeSut = (): SutType => {
  const sut = new PurchaseRepository();
  const houseSut = new HouseRepository();

  return { sut, houseSut };
};

const inserter = async(
  datas: any[],
  repo: PurchaseRepository | HouseRepository,
  index: number = 0
): Promise<void> => {
  if (index <= datas.length - 1) {
    const { id } = await repo.create(datas[index]);
    datas[index].id = id;
    await inserter(datas, repo, index + 1);
  }
};

describe('Purchase Repository - create', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should throws if tries to create a purchase of a house whose user is not member', async() => {
    const { sut, houseSut } = makeSut();
    await houseSut.create(house);
    const promise = sut.create({ ...purchase, userId: 999 });
    await expect(promise).rejects.toThrow();
  });

  test('Should throws if tries to create a purchase of a house that doesnt exist', async() => {
    const { sut, houseSut } = makeSut();
    await houseSut.create(house);
    const promise = sut.create({ ...purchase, houseId: 999 });
    await expect(promise).rejects.toThrow();
  });

  test('Should create successfuly', async() => {
    const { sut, houseSut } = makeSut();
    await houseSut.create(house);
    const createdPurchase = await sut.create(purchase);
    expect(createdPurchase).toEqual({ ...purchase });
  });
});

describe('Purchase Repository - get', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());
  const purchases = [
    {
      id: 0,
      userId,
      houseId: house.id,
      date: 1617388109773,
      description: 'Mercado',
      value: 7500,
    },
    {
      id: 0,
      userId,
      houseId: house.id,
      date: 1617388109790,
      description: 'Posto',
      value: 8000,
    },
    {
      id: 0,
      userId: 17,
      houseId: house.id,
      date: 1617388109790,
      description: 'Posto',
      value: 8000,
    }
  ];

  test('Should return empty array if there is no purchase', async() => {
    const { sut } = makeSut();
    const purchases = await sut.get(userId, house.id);
    expect(purchases.length).toBe(0);
  });

  test("Should return all house's purchase", async() => {
    const { sut, houseSut } = makeSut();
    await houseSut.create(house);
    await inserter(purchases, sut);
    const foundPurchases = await sut.get(userId, house.id);

    purchases.forEach((purchase) => {
      expect(foundPurchases).toContainEqual(purchase);
    });
  });

  test('Should return only purchases from houses that user is member', async() => {
    const userId1 = 3;
    const userId2 = 7;
    const house1 = {
      id: 0,
      userId: userId1,
      name: 'Casa do Rogerio',
      members: [userId1, 100],
    };
    const house2 = {
      id: 0,
      userId: userId2,
      name: 'Casa da Isabel',
      members: [userId2, 100],
    };
    const getPurchases1 = (): any[] => {
      return [
        {
          id: 0,
          userId: userId1,
          houseId: house1.id,
          date: 1617388109773,
          description: 'Mercado',
          value: 7500,
        },
        {
          id: 0,
          userId: 100,
          houseId: house1.id,
          date: 1617388109790,
          description: 'Posto',
          value: 8000,
        },
        {
          id: 0,
          userId: 100,
          houseId: house1.id,
          date: 1617388109790,
          description: 'Farmácia',
          value: 8000,
        }
      ];
    };
    const getPurchases2 = (): any[] => {
      return [
        {
          id: 0,
          userId: userId2,
          houseId: house2.id,
          date: 1617388109073,
          description: 'Restaurante',
          value: 3000,
        },
        {
          id: 0,
          userId: 100,
          houseId: house2.id,
          date: 1617389109790,
          description: 'Hospital',
          value: 78000,
        }
      ];
    };
    const { sut, houseSut } = makeSut();
    await inserter([house1, house2], houseSut);
    const purchases1 = getPurchases1();
    const purchases2 = getPurchases2();
    await inserter(purchases1, sut);
    await inserter(purchases2, sut);

    const userHouses1 = await sut.get(userId1, house1.id);

    expect(purchases1.length).not.toBe(purchases2.length);
    expect(userHouses1.length).toBe(purchases1.length);
    expect(userHouses1).toEqual(purchases1);
  });
});

describe('Purchase Repository - update', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  const updatePurchase = {
    description: 'Hirota Food',
    value: 10000,
    date: 1617388109000,
  };
  test('Should throws if other user tries to update a purchase', async() => {
    const { sut, houseSut } = makeSut();
    await houseSut.create(house);
    const { id } = await sut.create(purchase);
    const promise = sut.update({
      ...purchase,
      ...updatePurchase,
      id,
      userId: 999,
    });
    await expect(promise).rejects.toThrow();
  });

  test('Should update successfully', async() => {
    const { sut, houseSut } = makeSut();
    await houseSut.create(house);
    const { id } = await sut.create(purchase);
    const updatedPurchase = await sut.update({
      ...purchase,
      ...updatePurchase,
      id,
    });
    updatedPurchase.date = Number(updatePurchase.date);
    expect(updatedPurchase).toEqual({ ...purchase, ...updatePurchase, id });
  });
});

describe('Purchase Repository - delete', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should throws if other user tries to delete a purchase', async() => {
    const { sut, houseSut } = makeSut();
    await houseSut.create(house);
    const { id } = await sut.create(purchase);
    const promise = sut.delete(id, 333);
    await expect(promise).rejects.toThrow();
  });

  test('Should delete successfully', async() => {
    const { sut, houseSut } = makeSut();
    await houseSut.create(house);
    const { id } = await sut.create(purchase);
    await sut.delete(id, purchase.userId);
    const purchases = await sut.get(purchase.userId, purchase.houseId);
    expect(purchases.length).toBe(0);
  });
});
