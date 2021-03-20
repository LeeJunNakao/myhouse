import { HouseService } from './house';
import { HouseRepository as IHouseService } from '../../database/protocols';
import { CreateHouseDto, House } from '../House';
import { create } from 'node:domain';

const createHouse: CreateHouseDto = {
    name: 'My House',
    members: [2]
}

interface SutTypes {
    sut: HouseService,
    repoSut: IHouseService,
}

class HouseRepository implements IHouseService {
    async create(dto: CreateHouseDto): Promise<House> {
        return new Promise(resolve => resolve({ id: 10, ...dto }))
    }
}

const makeSut = (): SutTypes => {
    const repoSut = new HouseRepository();
    const sut = new HouseService(repoSut);
    return { sut, repoSut }
}

describe('House Service Unit', () => {
    test('Should throw if repo throws', async () => {
        const { sut, repoSut } = makeSut();
        jest.spyOn(repoSut, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
        const promise = sut.createHouse(createHouse);
        await expect(promise).rejects.toThrow();
    })

    test('Should call create with correct data', async () => {
        const { sut, repoSut } = makeSut();
        const repoSpy = jest.spyOn(repoSut, 'create');
        await sut.createHouse(createHouse);
        expect(repoSpy).toBeCalledWith(createHouse);
    })

    test('Should return House when correct data is provided', async () => {
        const { sut } = makeSut();
        const result = await sut.createHouse(createHouse);
        expect(result).toEqual({ id: 10, ...createHouse })
    })
})