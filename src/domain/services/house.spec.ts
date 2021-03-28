import { HouseService } from './house';
import { HouseRepository as IHouseRepository } from '../../database/protocols';
import { CreateHouseDto, House } from '../House';

const createHouse: CreateHouseDto = {
  userId: 1,
  name: 'My House',
  members: [2],
};

interface SutTypes {
  sut: HouseService,
  repoSut: IHouseRepository,
}

class HouseRepository implements IHouseRepository {
  async create(dto: CreateHouseDto): Promise<House> {
    return await new Promise(resolve => resolve({ id: 10, ...dto }));
  }

  async get(id: string | number): Promise<House[]> {
    return await new Promise(resolve => resolve([{ id: 10, ...createHouse }]));
  }

  async update(dto: House): Promise<House> {
    return await new Promise(resolve => resolve(dto));
  }

  async updateName(dto: House): Promise<House> {
    return await new Promise(resolve => resolve(dto));
  }

  async delete(id: string | number, userId: string | number): Promise<void> {
    await new Promise(resolve => resolve(null));
  }
}

const makeSut = (): SutTypes => {
  const repoSut = new HouseRepository();
  const sut = new HouseService(repoSut);
  return { sut, repoSut };
};

describe('House Service Unit - createHouse', () => {
  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.createHouse(createHouse);
    await expect(promise).rejects.toThrow();
  });

  test('Should call create with correct data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'create');
    await sut.createHouse(createHouse);
    expect(repoSpy).toBeCalledWith(createHouse);
  });

  test('Should return House when correct data is provided', async() => {
    const { sut } = makeSut();
    const result = await sut.createHouse(createHouse);
    expect(result).toEqual({ id: 10, ...createHouse });
  });
});

describe('House Service Unit - getHouseByUserId', () => {
  const userId = createHouse.members[0];

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.getHouseByUserId(userId);
    await expect(promise).rejects.toThrow();
  });

  test('Should call get with correct data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'get');
    await sut.getHouseByUserId(userId);
    expect(repoSpy).toBeCalledWith(userId);
  });

  test('Should return House when correct data is provided', async() => {
    const { sut } = makeSut();
    const result = await sut.getHouseByUserId(userId);
    expect(result).toEqual([{ id: 10, ...createHouse }]);
  });
});

describe('House Service Unit - updateHouse', () => {
  const updatedHouse: House = {
    id: 10,
    userId: 2,
    name: 'another name',
    members: [2, 10, 57],
  };

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.updateHouse(updatedHouse);
    await expect(promise).rejects.toThrow();
  });

  test('Should call update with correct data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'update');
    await sut.updateHouse(updatedHouse);
    expect(repoSpy).toBeCalledWith(updatedHouse);
  });

  test('Should return updated house', async() => {
    const { sut } = makeSut();
    const result = await sut.updateHouse(updatedHouse);
    expect(result).toEqual(updatedHouse);
  });
});

describe('House Service Unit - deleteHouse', () => {
  const deleteHouse = {
    id: 10,
    userId: 2,
  };

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'delete').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.deleteHouse(deleteHouse.id, deleteHouse.userId);
    await expect(promise).rejects.toThrow();
  });

  test('Should call delete with correct data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'delete');
    await sut.deleteHouse(deleteHouse.id, deleteHouse.userId);
    expect(repoSpy).toBeCalledWith(deleteHouse.id, deleteHouse.userId);
  });

  test('Should delete', async() => {
    const { sut } = makeSut();
    await sut.deleteHouse(deleteHouse.id, deleteHouse.userId);
  });
});
