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

const token = jwt.sign(user, process.env.JWT_KEY ?? 'secret_key');

const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTU4Mzg4NjYsImRhdGEiOnsiaWQiOjEsIm5hbWUiOiJBbGV4IExlZSBKdW4gTmFrYW8iLCJlbWFpbCI6ImxlZWp1bi5uYWthb0BnbWFpbC5jb20ifSwiaWF0IjoxNjE1NzUyNDY2fQ.x-taEGF9AZEuHq3OiALnbgVZ1-iFXTonQqy-lm5Bj3A';

describe('House route - POST', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  const houseData = {
    name: 'Casa',
    members: [17, 3],
  };

  test('Should return 401 if token is not valid', async() => {
    await request(app)
      .post('/house')
      .set('token', invalidToken)
      .send(houseData)
      .expect(401);
  });

  test('Should return 400 if name is not provided', async() => {
    await request(app)
      .post('/house')
      .set('token', token)
      .send({ ...houseData, name: '' })
      .expect(400);
  });

  test('Should create house only with user as member is member is not provided', async() => {
    await request(app)
      .post('/house')
      .set('token', token)
      .send({ ...houseData, members: null })
      .expect(200)
      .then(response => {
        const { name, members } = response.body;
        expect(name).toBe(houseData.name);
        expect(members).toEqual([user.id]);
      });
  });

  test('Should create house with user as member if he is not included in payload', async() => {
    const modifiedMembers = [1, 2, 3];

    await request(app)
      .post('/house')
      .set('token', token)
      .send({ ...houseData, members: modifiedMembers })
      .expect(200)
      .then(response => {
        const { name, members } = response.body;
        expect(name).toBe(houseData.name);
        expect(members).toEqual([...modifiedMembers, user.id]);
      });
  });

  test('Should create house if all data is valid', async() => {
    await request(app)
      .post('/house')
      .set('token', token)
      .send(houseData)
      .expect(200)
      .then(response => {
        const { name, members } = response.body;
        expect(name).toBe(houseData.name);
        expect(members).toEqual(houseData.members);
      });
  });
});

describe('House route - GET', () => {
  const houses = [
    {
      name: 'Casa Principal',
      members: [17, 3],
    },
    {
      name: 'Apartamento',
      members: [17],
    },
    {
      name: 'Casa de Férias',
      members: [5, 25, 29, 40],
    }
  ];
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should return 200', async() => {
    await request(app)
      .post('/house')
      .set('token', token)
      .send(houses[0]);

    await request(app)
      .post('/house')
      .set('token', token)
      .send(houses[1]);

    await request(app)
      .post('/house')
      .set('token', token)
      .send(houses[2]);

    await request(app)
      .get('/house')
      .set('token', token)
      .then(response => {
        const { body } = response;

        const fetchedHouses = body.map(({ name, members }) => ({ name, members }));

        houses.forEach(house => {
          const userId = Number(user.id);
          if (!house.members.includes(userId)) house.members.push(userId);
          expect(fetchedHouses).toContainEqual(house);
        });
      });
  });
});
