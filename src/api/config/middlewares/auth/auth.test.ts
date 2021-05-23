import request from 'supertest';
import app from '../../../app';
import jwt from 'jsonwebtoken';

const userData = {
  id: 1,
  name: 'João das Neves',
  email: 'joao@snow.com.br',
};

const token = jwt.sign(userData, process.env.JWT_KEY ?? 'secret_key');

describe('Auth Middleware - GET', () => {
  test('Should return 401 if token is not provided', async() => {
    app.get('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .get('/test_auth')
      .expect(401);
  });

  test('Should return 401 if token is invalid', async() => {
    app.get('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .get('/test_auth')
      .set('token', 'invalid_token')
      .expect(401);
  });

  test('Should return 200 if token is valid', async() => {
    app.get('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .get('/test_auth')
      .set('token', token)
      .expect(200)
      .expect({ userId: userData.id });
  });
});

describe('Auth Middleware - POST', () => {
  test('Should return 401 if token is not provided', async() => {
    app.post('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .post('/test_auth')
      .expect(401);
  });

  test('Should return 401 if token is invalid', async() => {
    app.post('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .post('/test_auth')
      .set('token', 'invalid_token')
      .expect(401);
  });

  test('Should return 200 if token is valid', async() => {
    app.post('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .post('/test_auth')
      .set('token', token)
      .expect(200)
      .expect({ userId: userData.id });
  });

  test('Should not be possible set userId by user', async() => {
    app.post('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    const injectedId = 99;

    await request(app)
      .post('/test_auth')
      .set('token', token)
      .send({ userId: injectedId })
      .expect(200)
      .expect({ userId: userData.id });
  });
});

describe('Auth Middleware - PUT', () => {
  test('Should return 401 if token is not provided', async() => {
    app.put('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .put('/test_auth')
      .expect(401);
  });

  test('Should return 401 if token is invalid', async() => {
    app.put('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .put('/test_auth')
      .set('token', 'invalid_token')
      .expect(401);
  });

  test('Should return 200 if token is valid', async() => {
    app.put('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .put('/test_auth')
      .set('token', token)
      .expect(200)
      .expect({ userId: userData.id });
  });
});

describe('Auth Middleware - DELETE', () => {
  test('Should return 401 if token is not provided', async() => {
    app.delete('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .delete('/test_auth')
      .expect(401);
  });

  test('Should return 401 if token is invalid', async() => {
    app.delete('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .delete('/test_auth')
      .set('token', 'invalid_token')
      .expect(401);
  });

  test('Should return 200 if token is valid', async() => {
    app.delete('/test_auth', (req, res) => res.status(200).send({ userId: req.body.userId }));

    await request(app)
      .delete('/test_auth')
      .set('token', token)
      .expect(200)
      .expect({ userId: userData.id });
  });
});
