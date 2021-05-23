import { PurchaseController } from './purchase';
import { HouseController } from '../house/house';
import { mountHouse } from '../house';
import { mountPurchase } from '.';
import { truncateDatabase } from '../../../database/helpers/query-helper';
import { missingFieldsError, notAuthorizedError } from '../../helper/handleError';
import { House } from '../../../database/typeorm/myhouse/src/entity/House';

const userId = 17;

const house = {
  name: 'House Name',
  members: [userId, 10, 20],
  userId,
};

const purchase = {
  userId,
  description: 'Amazon',
  value: 22000,
  date: Date.now(),
};

interface SutTypes {
  sut: PurchaseController,
  houseSut: HouseController,
}

const makeSut = (): SutTypes => {
  const sut = mountPurchase();
  const houseSut = mountHouse();

  return { sut, houseSut };
};

const formatPurchase = (purchase): any => {
  return { ...purchase, value: purchase.value / 100 };
};

const createHouse = async(payload = house): Promise<House> => {
  const { houseSut } = makeSut();
  const httpResponse = await houseSut.post({ body: payload });
  return httpResponse.body;
};

describe('Purchase Controller Integration - POST', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should return 400 if required fields are not provided', async() => {
    const { sut } = makeSut();
    const createdHouse = await createHouse();
    const requiredFields = ['userId', 'houseId', 'date', 'description', 'value'];
    requiredFields.forEach(async field => {
      const houseId = createdHouse.id;
      const body = { ...purchase, houseId };
      body[field] = null;
      const httpResponse = await sut.post({ body });
      expect(httpResponse).toEqual(missingFieldsError([field]));
    });
  });

  test('Should return 401 when tried to created a purchase of house that user is not member', async() => {
    const { sut } = makeSut();
    const { id: houseId } = await createHouse();
    const httpResponse = await sut.post({ body: { ...purchase, houseId, userId: 999 } });
    expect(httpResponse.status).toBe(401);
  });

  test('Should return 200', async() => {
    const { sut } = makeSut();
    const { id: houseId } = await createHouse();
    const httpResponse = await sut.post({ body: { ...purchase, houseId } });
    expect(httpResponse.status).toBe(201);
    expect(httpResponse.body).toEqual(formatPurchase({ ...purchase, houseId, id: httpResponse.body.id }));
  });
});

describe('Purchase Controller Integration - GET', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  const purchases = [
    {
      id: 0,
      houseId: 0,
      userId,
      description: 'Mercado',
      value: 7700,
      date: Date.now(),
    },
    {
      id: 0,
      houseId: 0,
      userId,
      description: 'Bar',
      value: 6000,
      date: Date.now(),
    },
    {
      id: 0,
      houseId: 0,
      userId,
      description: 'Posto',
      value: 5520,
      date: Date.now(),
    }
  ];

  test('Should return all purchases of a member', async() => {
    const { sut } = makeSut();
    const { id: houseId } = await createHouse();
    const promises = purchases.map(async purchase => {
      const httpResponse = await sut.post({ body: { ...purchase, houseId } });
      const { id } = httpResponse.body;
      purchase.id = id;
      purchase.houseId = houseId;
    });
    await Promise.all(promises);
    const httpResponse = await sut.get({ body: { userId, houseId } });
    expect(httpResponse.body.length).toBe(3);
    expect(httpResponse.body).toEqual(purchases.map(p => formatPurchase(p)));
  });

  test('Should not return purchases of a house that user is not member', async() => {
    const { sut } = makeSut();
    const { id: houseId } = await createHouse();
    const promises = purchases.map(async purchase => {
      const httpResponse = await sut.post({ body: { ...purchase, houseId } });
      const { id } = httpResponse.body;
      purchase.id = id;
      purchase.houseId = houseId;
    });
    await Promise.all(promises);
    const httpResponse = await sut.get({ body: { userId: 99, houseId } });
    expect(httpResponse.body).toEqual([]);
  });
});

describe('Purchase Controller Integration - PUT', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  const updatePurchase = {
    userId,
    description: 'Amazon',
    value: 22000,
    date: '1617568128168',
  };

  test('Should return 401 when user tries update a purchase of another user', async() => {
    const { sut } = makeSut();
    const { id: houseId } = await createHouse();
    const { body: createdPurchase } = await sut.post({ body: { ...purchase, houseId } });
    const httpResponse = await sut.put({ body: { ...createdPurchase, ...updatePurchase, userId: house.members[1] } });
    expect(httpResponse).toEqual(notAuthorizedError());
  });

  test('Should return 201', async() => {
    const { sut } = makeSut();
    const { id: houseId } = await createHouse();
    const { body: createdPurchase } = await sut.post({ body: { ...purchase, houseId } });
    const httpResponse = await sut.put({ body: { ...createdPurchase, ...updatePurchase } });
    expect(httpResponse.status).toBe(201);
    expect(httpResponse.body).toEqual(formatPurchase({ ...createdPurchase, ...updatePurchase }));
  });
});

describe('Purchase Controller Integration - DELETE', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should return 401 when user tries delete a purchase of another user', async() => {
    const { sut } = makeSut();
    const { id: houseId } = await createHouse();
    const { body: createdPurchase } = await sut.post({ body: { ...purchase, houseId } });
    const httpResponse = await sut.delete({ body: { id: createdPurchase.id, userId: house.members[1] } });
    expect(httpResponse).toEqual(notAuthorizedError());
  });

  test('Should return 201', async() => {
    const { sut } = makeSut();
    const { id: houseId } = await createHouse();
    const { body: createdPurchase } = await sut.post({ body: { ...purchase, houseId } });
    await sut.delete({ body: { id: createdPurchase.id, userId } });
    const httpResponse = await sut.get({ body: { userId, houseId } });
    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual([]);
  });
});
