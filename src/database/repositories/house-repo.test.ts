import { HouseRepository } from './house-repo';
import { CreateHouseDto } from '../../domain/House';
import { truncateDatabase } from '../helpers/query-helper';

const createHouseDto: CreateHouseDto = {
  name: 'Casa de alguém',
  members: [1, 2, 3, 10],
  userId: 10,
};

describe('House Repository - create', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should insert into database successfully', async() => {
    const repo = new HouseRepository();
    const house = await repo.create(createHouseDto);
    expect(house).toEqual({ ...createHouseDto, id: 1 });
  });
});

describe('House Repository - update', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should update successfully', async() => {
    const repo = new HouseRepository();
    const { userId } = createHouseDto;
    const { id } = await repo.create(createHouseDto);
    const house = await repo.update({ id, name: 'Novo nome', members: [1, 2], userId });
    expect(house).toEqual({ id, name: 'Novo nome', members: [1, 2], userId });
  });

  test('Should throw if a not owner tries update members', async() => {
    const repo = new HouseRepository();
    const { id } = await repo.create(createHouseDto);
    const promise = repo.update({ id, name: 'Novo nome', members: [1, 2], userId: 999 });
    await expect(promise).rejects.toThrow();
  });
});

describe('House Repository - updateName', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should update successfully', async() => {
    const repo = new HouseRepository();
    const createdHouse = await repo.create(createHouseDto);
    const house = await repo.updateName({ ...createdHouse, name: 'Novo' });
    expect(house).toEqual({ ...createdHouse, name: 'Novo' });
  });

  test('Should not alter members', async() => {
    const repo = new HouseRepository();
    const createdHouse = await repo.create(createHouseDto);
    const updatedHouse = await repo.updateName({ ...createdHouse, members: [100, 200, 300] });
    expect(updatedHouse).toEqual(createdHouse);
  });

  test('Should throw if a not member tries update name', async() => {
    const repo = new HouseRepository();
    const createdHouse = await repo.create(createHouseDto);
    const promise = repo.updateName({ ...createdHouse, name: "Mom Joana's house", userId: 999 });
    await expect(promise).rejects.toThrow();
  });
});

describe('House Repository - get', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should get by id successfully', async() => {
    const repo = new HouseRepository();
    const { id } = await repo.create(createHouseDto);
    const house = await repo.get(createHouseDto.members[0]);
    expect(house).toEqual([{ id, ...createHouseDto }]);
  });

  test('Should get all houses that user owns', async() => {
    const commomMember = 1;
    const { userId } = createHouseDto;
    const houseDto = { name: 'Casa de Fulano', members: [commomMember, 2, 3], userId };
    const houseDto2 = { name: 'Casa de Beltrano', members: [commomMember, 7, 8], userId };
    const repo = new HouseRepository();
    const house1 = await repo.create(houseDto);
    const house2 = await repo.create(houseDto2);
    const houses = await repo.get(commomMember);
    expect(houses.length).toEqual(2);
    expect(houses).toContainEqual(house1);
    expect(houses).toContainEqual(house2);
  });
});

describe('House Repository - delete', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should delete successfully', async() => {
    const repo = new HouseRepository();
    const { id, userId } = await repo.create(createHouseDto);
    const houses = await repo.get(userId);
    expect(houses.length).toBeGreaterThan(0);
    await repo.delete(id, userId);
    const houses2 = await repo.get(userId);
    expect(houses2.length).toBe(0);
  });

  test('Should throws if a not owner tries to delete', async() => {
    const repo = new HouseRepository();
    const createdHouse = await repo.create(createHouseDto);
    const houses = await repo.get(createdHouse.userId);
    expect(houses.length).toBeGreaterThan(0);
    const promise = repo.delete(createdHouse.id, 999);
    await expect(promise).rejects.toThrow();
  });
});
