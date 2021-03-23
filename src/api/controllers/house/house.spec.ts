import Controller from '../GenericController';
import { HouseController } from './house';
import { HouseService } from '../../../domain/protocols/services';
import { CreateHouseDto, House } from '../../../domain/House';
import { missingFieldsError, serverError } from '../../helper/handleError';

const house = {
  name: 'valid_name',
  members: [5, 15],
  userId: 5,
};

interface SutType {
  sut: Controller,
  serviceSut: HouseService,
};

class HouseServiceSut implements HouseService {
  async createHouse(house: CreateHouseDto): Promise<House> {
    return await new Promise(resolve => resolve({ id: 10, name: house.name, members: house.members, userId: house.userId }));
  }

  async getHouseByMemberId(memberId: number | string): Promise<House[]> {
    return await new Promise(resolve => resolve([{ id: 10, name: house.name, members: house.members, userId: house.userId }]));
  }

  async updateHouse(house: House): Promise<House> {
    return await new Promise(resolve => resolve(house));
  }
}

const makeSut = (): SutType => {
  const serviceSut = new HouseServiceSut();
  const sut = new HouseController(serviceSut);
  return { sut, serviceSut };
};

describe('House Controller Unit - POST', () => {
  test('Should return 400 if name is not provided', async() => {
    const { sut } = makeSut();
    const response = await sut.post({ body: { ...house, name: '' } });
    expect(response).toEqual(missingFieldsError(['name']));
  });

  test('Should return house with user as only member if members field is not provided', async() => {
    const { sut } = makeSut();
    const response = await sut.post({ body: { ...house, members: null } });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 10, name: house.name, members: [house.userId] });
  });

  test('Should return 500 if service throws', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'createHouse').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const response = await sut.post({ body: house });
    expect(response).toEqual(serverError());
  });

  test('Should call createHouse with correct data', async() => {
    const { sut, serviceSut } = makeSut();
    const serviceSpy = jest.spyOn(serviceSut, 'createHouse');
    await sut.post({ body: house });
    expect(serviceSpy).toBeCalledWith(house);
  });

  test('Should return 200 if valid data is provided', async() => {
    const { sut } = makeSut();
    const response = await sut.post({ body: house });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 10, name: house.name, members: house.members });
  });
});

describe('House Controller Unit - GET', () => {
  const userId = 5;

  test('Should return 500 if userId is not provided', async() => {
    const { sut } = makeSut();
    const response = await sut.get({ body: { userId: null } });
    expect(response).toEqual(serverError());
  });

  test('Should return 500 if service throws', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'getHouseByMemberId').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const response = await sut.get({ body: { userId } });
    expect(response).toEqual(serverError());
  });

  test('Should call getHouseByMemberId with correct data', async() => {
    const { sut, serviceSut } = makeSut();
    const serviceSpy = jest.spyOn(serviceSut, 'getHouseByMemberId');
    await sut.get({ body: { userId } });
    expect(serviceSpy).toBeCalledWith(userId);
  });

  test('Should return 200 if valid data is provided', async() => {
    const { sut } = makeSut();
    const response = await sut.get({ body: { userId } });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 10, ...house }]);
  });
});

describe('House Controller Unit - PUT', () => {
  const updatedHouse = {
    id: 10,
    name: 'another name',
    members: [5, 17, 33],
  };

  test('Should return 400 if id is not provided', async() => {
    const { sut } = makeSut();
    const response = await sut.put({ body: { ...updatedHouse, id: '' } });
    expect(response).toEqual(missingFieldsError(['id']));
  });

  test('Should return 400 if name is not provided', async() => {
    const { sut } = makeSut();
    const response = await sut.put({ body: { ...updatedHouse, name: '' } });
    expect(response).toEqual(missingFieldsError(['name']));
  });

  test('Should return 500 if service throws', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'updateHouse').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const response = await sut.put({ body: updatedHouse });
    expect(response).toEqual(serverError());
  });

  test('Should call updateHouse with correct data', async() => {
    const { sut, serviceSut } = makeSut();
    const serviceSpy = jest.spyOn(serviceSut, 'updateHouse');
    await sut.put({ body: updatedHouse });
    expect(serviceSpy).toBeCalledWith(updatedHouse);
  });

  test('Should return 200 if valid data is provided', async() => {
    const { sut } = makeSut();
    const response = await sut.put({ body: updatedHouse });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedHouse);
  });
});
