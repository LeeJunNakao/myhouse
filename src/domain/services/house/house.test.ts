import { HouseRepository } from '../../../database/repositories/house-repo';
import { CreateHouseDto } from '../../../domain/House';
import { truncateDatabase } from '../../../database/helpers/query-helper';
import { HouseService } from './house';

const createHouseDto: CreateHouseDto = {
  name: 'Casa de alguém',
  members: [1, 2, 3],
  userId: 10,
};

const makeSut = (): HouseService => {
  const repo = new HouseRepository();
  return new HouseService(repo);
};

describe('House Repository', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should create house successfully', async() => {
    const sut = makeSut();
    const house = await sut.createHouse(createHouseDto);

    expect(house).toEqual({ ...createHouseDto, id: 1 });
  });

  test('Should get houses successfully', async() => {
    const sut = makeSut();
    const { userId } = createHouseDto;
    const houseDto1 = { name: 'Casa', members: [userId, 22, 31, 39], userId };
    const houseDto2 = { name: 'Apartamento', members: [userId, 88, 185] };
    const createdHouse1 = await sut.createHouse({ ...houseDto1, userId });
    const createdHouse2 = await sut.createHouse({ ...houseDto2, userId });
    const houses = await sut.getHouseByUserId(userId);

    expect(houses.length).toEqual(2);
    expect(houses).toContainEqual(createdHouse1);
    expect(houses).toContainEqual(createdHouse2);
  });

  test('Should update house successfully', async() => {
    const sut = makeSut();
    const { id } = await sut.createHouse(createHouseDto);
    const updateData = { ...createHouseDto, id, name: 'Apartamento' };
    const house = await sut.updateHouse(updateData);
    expect(house).toEqual({ ...updateData });
  });

  test('Should delete house succesfully', async() => {
    const sut = makeSut();
    const { id, userId } = await sut.createHouse(createHouseDto);
    await sut.deleteHouse(id, userId);
    const houses = await sut.getHouseByUserId(userId);
    expect(houses.length).toBe(0);
  });
});
