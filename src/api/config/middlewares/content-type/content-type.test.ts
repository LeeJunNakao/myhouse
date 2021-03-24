import request from 'supertest';
import app from '../../../app';
import jwt from 'jsonwebtoken';

const userData = {
  id: 1,
  name: 'João das Neves',
  email: 'joao@snow.com.br',
};

const token = jwt.sign(userData, process.env.JWT_KEY ?? 'secret_key');

describe('Content Type Middlware', () => {
  test('Should return json as default', async() => {
    app.get('/content_type', (req, res) => res.send({ message: 'hello' }));

    await request(app)
      .get('/content_type')
      .set('token', token)
      .expect('content-type', /json/);
  });

  test('Should return xml when type is set', async() => {
    app.get('/content_type_xml', (req, res) => {
      res.type('xml');
      res.send('');
    });

    await request(app)
      .get('/content_type_xml')
      .set('token', token)
      .expect('content-type', /xml/);
  });
});
