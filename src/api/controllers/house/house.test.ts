import { mountHouse } from '.';
import { missingFieldsError, serverError, notAuthorizedError } from '../../helper/handleError';
import { truncateDatabase } from '../../../database/helpers/query-helper';

const userId = 55;

const createHouseData = {
  name: 'House Name',
  members: [55, 10, 20],
};

describe('House Controller Integration - POST', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  const httpRequest = {
    body: {
      ...createHouseData,
      userId,
    },
  };
  test('Should return 500 if no data is provided', async() => {
    const sut = mountHouse();
    const httpResponse = await sut.post({ body: {} });
    expect(httpResponse).toEqual(serverError());
  });

  test('Should return 400 if no name is provided', async() => {
    const sut = mountHouse();
    const httpResponse = await sut.post({ ...httpRequest, body: { ...httpRequest.body, name: '' } });
    expect(httpResponse).toEqual(missingFieldsError(['name']));
  });

  test('Should return 500 if no userId is provided', async() => {
    const sut = mountHouse();
    const httpResponse = await sut.post({ ...httpRequest, body: { ...httpRequest.body, userId: null } });
    expect(httpResponse).toEqual(serverError());
  });

  test('Should return created house with user as only member if no members is provided', async() => {
    const sut = mountHouse();
    const httpResponse = await sut.post({ ...httpRequest, body: { ...httpRequest.body, members: null } });
    const { name, members, id } = httpResponse.body;
    expect(httpResponse.status).toBe(200);
    expect(id).toBeTruthy();
    expect(name).toEqual(httpRequest.body.name);
    expect(members).toEqual([userId]);
  });

  test('Should return created house with user as member if user is not included in house', async() => {
    const sut = mountHouse();
    const httpResponse = await sut.post({ ...httpRequest, body: { ...httpRequest.body, members: [100, 200] } });
    const { name, members, id } = httpResponse.body;
    expect(httpResponse.status).toBe(200);
    expect(id).toBeTruthy();
    expect(name).toEqual(httpRequest.body.name);
    expect(members).toEqual([100, 200, userId]);
  });

  test('Should return created house if all data is valid', async() => {
    const sut = mountHouse();
    const httpResponse = await sut.post(httpRequest);
    const { name, members, id } = httpResponse.body;
    expect(httpResponse.status).toBe(200);
    expect(id).toBeTruthy();
    expect(name).toEqual(httpRequest.body.name);
    expect(members).toEqual(httpRequest.body.members);
  });
});

describe('House Controller Integration - GET', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  const httpRequest = { body: { userId } };

  const createHouseData2 = {
    name: 'My House',
    members: [72, 201],
  };

  test('Should return empty array if user had not created any house', async() => {
    const sut = mountHouse();
    const response = await sut.get(httpRequest);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Should return all user's house", async() => {
    const sut = mountHouse();
    await sut.post({ body: { ...createHouseData, userId } });
    await sut.post({ body: { ...createHouseData2, userId } });
    const response = await sut.get(httpRequest);
    const housesNames = response.body.map(h => h.name);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
    expect(housesNames).toContainEqual(createHouseData.name);
    expect(housesNames).toContainEqual(createHouseData2.name);
  });
});

describe('House Controller Integration - PUT', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  const updateHouseData = {
    name: 'Updated Name',
  };

  test('Should return updated house', async() => {
    const sut = mountHouse();
    const createdHouse = await sut.post({ body: { userId, ...createHouseData } });
    const { id } = createdHouse.body;
    const response = await sut.put({ body: { userId, id, ...updateHouseData } });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateHouseData.name);
    expect(response.body.members).toEqual(createHouseData.members);
  });

  test('Should return name if user is member', async() => {
    const sut = mountHouse();
    const createdHouse = await sut.post({ body: { userId: 999, ...createHouseData } });
    const { id } = createdHouse.body;
    const response = await sut.put({ body: { userId, id, ...updateHouseData } });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateHouseData.name);
  });

  test('Should return error 401 if not owner tries alter members', async() => {
    const sut = mountHouse();
    const createdHouse = await sut.post({ body: { userId: 999, ...createHouseData } });
    const { id } = createdHouse.body;
    const response = await sut.put({ body: { userId, id, ...updateHouseData, members: [111] } });
    expect(response.status).toBe(401);
  });

  test('Should return error 401 user is not member', async() => {
    const sut = mountHouse();
    const createdHouse = await sut.post({ body: { userId, ...createHouseData } });
    const { id } = createdHouse.body;
    const response = await sut.put({ body: { userId: 2, id, ...updateHouseData } });
    expect(response.status).toBe(401);
    expect(response).toEqual(notAuthorizedError());
  });

  test('Should not modify members if it is an empty array', async() => {
    const sut = mountHouse();
    const createdHouse = await sut.post({ body: { userId, ...createHouseData } });
    const { id } = createdHouse.body;
    const response = await sut.put({ body: { userId, id, ...updateHouseData, members: [] } });
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(updateHouseData.name);
    expect(response.body.members).toEqual(createHouseData.members);
  });
});

describe('House Controller Integration - DELETE', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should delete succesfully', async() => {
    const sut = mountHouse();
    const createdHouse = await sut.post({ body: { ...createHouseData, userId } });
    const { id } = createdHouse.body;
    await sut.delete({ body: { id, userId } });
    const { body: houses } = await sut.get({ body: { userId } });
    expect(houses.length).toBe(0);
  });
});
