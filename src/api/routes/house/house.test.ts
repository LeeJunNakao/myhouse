import request from 'supertest';
import app from '../../app';
import { User } from '../../protocols/index';
import jwt from 'jsonwebtoken';
import { truncateDatabase } from '../../../database/helpers/query-helper';

const houseData = {
  name: 'Casa',
  members: [17, 3],
};

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
        console.log(response.body);
        expect(name).toBe(houseData.name);
        expect(members).toEqual([user.id]);
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
