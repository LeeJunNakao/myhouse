import Controller from '../GenericController';
import { HouseController } from './house';
import { HouseService } from '../../../domain/protocols/services';
import { CreateHouseDto, House } from '../../../domain/House';
import { missingFieldsError, serverError } from '../../helper/handleError';

const house = {
  name: 'valid_name',
  members: [5, 15],
};

interface SutType {
  sut: Controller,
  serviceSut: HouseService,
};

class HouseServiceSut implements HouseService {
  async createHouse(house: CreateHouseDto): Promise<House> {
    return await new Promise(resolve => resolve({ id: 10, name: house.name, members: house.members }));
  }
}

const makeSut = (): SutType => {
  const serviceSut = new HouseServiceSut();
  const sut = new HouseController(serviceSut);
  return { sut, serviceSut };
};

describe('House Controller Unit - Post', () => {
  test('Should return 400 if name is not provided', async() => {
    const { sut } = makeSut();
    const response = await sut.post({ body: { ...house, name: '' } });
    expect(response).toEqual(missingFieldsError(['name']));
  });

  test('Should return 400 if members is not provided', async() => {
    const { sut } = makeSut();
    const response = await sut.post({ body: { ...house, members: '' } });
    expect(response).toEqual(missingFieldsError(['members']));
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
    expect(response.body).toEqual({ id: 10, ...house });
  });
});
