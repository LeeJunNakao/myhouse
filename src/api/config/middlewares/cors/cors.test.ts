import request from 'supertest';
import app from '../../../app';
import jwt from 'jsonwebtoken';

const userData = {
  id: 1,
  name: 'João das Neves',
  email: 'joao@snow.com.br',
};

const token = jwt.sign({ data: userData }, process.env.JWT_KEY ?? 'secret_key');

describe('CORS Middleware', () => {
  test('Should enable CORS', async() => {
    app.get('/test_cors', (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_cors')
      .set('token', token)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
