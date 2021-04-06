import request from 'supertest';
import app from '../../app';
import { User } from '../../protocols/index';
import jwt from 'jsonwebtoken';
import { truncateDatabase } from '../../../database/helpers/query-helper';

const user: User = {
  id: 17,
  name: 'Rosangela',
  email: 'rosangela@email.com',
};

const houseData = {
  name: 'Casa',
  members: [17, 3],
};

const purchase = {
  userId: user.id,
  date: Date.now(),
  description: 'Restaurante',
  value: 5043,
};

const token = jwt.sign(user, process.env.JWT_KEY ?? 'secret_key');

const formatPurchase = (purchase): any => {
  return { ...purchase, value: purchase.value / 100 };
};

describe('Purchase route - POST', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should not create purchase of a house that user is not a member', async() => {
    const anotherUser = {
      id: 99,
      name: 'Maicon',
      email: 'maicon@email.com',
    };
    const anotherUserToken = jwt.sign(anotherUser, process.env.JWT_KEY ?? 'secret_key');

    const { body: createdHouse } = await request(app)
      .post('/house')
      .set('token', token)
      .send({ ...houseData })
      .expect(200);

    await request(app)
      .post(`/house/${createdHouse.id}/purchase`)
      .set('token', anotherUserToken)
      .send(purchase)
      .expect(401);
  });

  test('Should return 200', async() => {
    const { body: createdHouse } = await request(app)
      .post('/house')
      .set('token', token)
      .send(houseData)
      .expect(200);

    const { body: createdPurchase } = await request(app)
      .post(`/house/${createdHouse.id}/purchase`)
      .set('token', token)
      .send(purchase)
      .expect(201);

    expect(createdPurchase).toEqual({ ...formatPurchase(purchase), id: createdPurchase.id, houseId: createdHouse.id });
  });
});

describe('Purchase route - GET', () => {
  const purchases = [
    {
      id: 0,
      userId: user.id,
      date: Date.now(),
      description: 'Restaurante',
      value: 7530,
    },
    {
      id: 0,
      userId: user.id,
      date: Date.now(),
      description: 'Posto',
      value: 10000,
    }
  ];

  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should return 200', async() => {
    const { body: createdHouse } = await request(app)
      .post('/house')
      .set('token', token)
      .send(houseData)
      .expect(200);

    const promises = purchases.map(async p => {
      const { body: createdPurchase } = await request(app)
        .post(`/house/${createdHouse.id}/purchase`)
        .set('token', token)
        .send(p);

      p.id = createdPurchase.id;
    });

    await Promise.all(promises);

    const { body: foundPurchases } = await request(app)
      .get(`/house/${createdHouse.id}/purchase`)
      .set('token', token);

    expect(foundPurchases.length).toBe(2);
    purchases.forEach(p => expect(foundPurchases).toContainEqual({ ...formatPurchase(p), houseId: createdHouse.id }));
  });
});

describe('Purchase route - PUT', () => {
  const updatePurchaseData = {
    date: 1617669105918,
    description: 'Balada',
    value: 18000,
  };

  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should return 200', async() => {
    const { body: createdHouse } = await request(app)
      .post('/house')
      .set('token', token)
      .send(houseData);

    const { body: createdPurchase } = await request(app)
      .post(`/house/${createdHouse.id}/purchase`)
      .set('token', token)
      .send(purchase);

    const { body: updatedPurchase } = await request(app)
      .put(`/house/${createdHouse.id}/purchase/${createdPurchase.id}`)
      .set('token', token)
      .send(updatePurchaseData);

    expect(updatedPurchase).toEqual(formatPurchase({ ...purchase, ...updatePurchaseData, houseId: createdHouse.id, id: createdPurchase.id, date: String(updatePurchaseData.date) }));
  });
});

describe('Purchase route - DELETE', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should return 200 if deleted', async() => {
    const { body: createdHouse } = await request(app)
      .post('/house')
      .set('token', token)
      .send(houseData);

    const { body: createdPurchase } = await request(app)
      .post(`/house/${createdHouse.id}/purchase`)
      .set('token', token)
      .send(purchase);

    await request(app)
      .get(`/house/${createdHouse.id}/purchase`)
      .set('token', token)
      .then(response => {
        expect(response.body.length).toBe(1);
        expect(response.body).toContainEqual(createdPurchase);
      });

    await request(app)
      .delete(`/house/${createdHouse.id}/purchase/${createdPurchase.id}`)
      .set('token', token)
      .expect(200);

    const { body: foundPurchases } = await request(app)
      .get(`/house/${createdHouse.id}/purchase`)
      .set('token', token);

    expect(foundPurchases.length).toBe(0);
  });
});
