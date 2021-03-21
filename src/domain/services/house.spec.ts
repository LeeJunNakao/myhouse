import { HouseService } from './house';
import { HouseRepository as IHouseService } from '../../database/protocols';
import { CreateHouseDto, House } from '../House';

const createHouse: CreateHouseDto = {
  name: 'My House',
  members: [2],
};

interface SutTypes {
  sut: HouseService,
  repoSut: IHouseService,
}

class HouseRepository implements IHouseService {
  async create(dto: CreateHouseDto): Promise<House> {
    return await new Promise(resolve => resolve({ id: 10, ...dto }));
  }

  async get(id: string | number): Promise<House[]> {
    return await new Promise(resolve => resolve([{ id: 10, ...createHouse }]));
  }

  async update(dto: House): Promise<House> {
    return await new Promise(resolve => resolve(dto));
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

describe('House Service Unit - getHouseByMemberId', () => {
  const memberId = createHouse.members[0];

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.getHouseByMemberId(memberId);
    await expect(promise).rejects.toThrow();
  });

  test('Should call get with correct data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'get');
    await sut.getHouseByMemberId(memberId);
    expect(repoSpy).toBeCalledWith(memberId);
  });

  test('Should return House when correct data is provided', async() => {
    const { sut } = makeSut();
    const result = await sut.getHouseByMemberId(memberId);
    expect(result).toEqual([{ id: 10, ...createHouse }]);
  });
});

describe('House Service Unit - updateHouse', () => {
  const updatedHouse = {
    id: 10,
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
