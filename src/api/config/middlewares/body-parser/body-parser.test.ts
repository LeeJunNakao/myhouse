import request from 'supertest';
import app from '../../../app';
import jwt from 'jsonwebtoken';

const userData = {
  id: 1,
  name: 'João das Neves',
  email: 'joao@snow.com.br',
};

const token = jwt.sign(userData, process.env.JWT_KEY ?? 'secret_key');

describe('Body Parser Middleware', () => {
  test('Should parse body as json', async() => {
    app.post('/test_body_parse', (req, res) => res.json(req.body));

    await request(app)
      .post('/test_body_parse')
      .send({ content: 'test' })
      .set('token', token)
      .expect({ content: 'test', userId: userData.id });
  });
});
