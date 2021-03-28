import { PurchaseController } from './purchase';
import { PurchaseService as IPurchaseService } from '../../../domain/services/purchase';
import { Purchase, CreatePurchaseDto, UpdatePurchaseDto } from '../../../domain/Purchase';
import { serverError, missingFieldsError, notAuthorizedError } from '../../helper/handleError';

const purchaseDto: Purchase = {
  id: 5,
  userId: 10,
  houseId: 9,
  date: Date.now(),
  description: 'Mercado',
  value: 12000,
};

class PurchaseService implements IPurchaseService {
  async create(dto: CreatePurchaseDto): Promise<Purchase> {
    return await new Promise(resolve => resolve({ ...purchaseDto, value: Number(purchaseDto.value) / 100 }));
  }

  async get(userId: String | Number, houseId: String | Number): Promise<Purchase[]> {
    return await new Promise(resolve => resolve([{ ...purchaseDto, value: Number(purchaseDto.value) / 100 }]));
  }

  async update(dto: UpdatePurchaseDto): Promise<Purchase> {
    return await new Promise(resolve => resolve({ ...purchaseDto, ...dto, value: Number(dto.value) / 100 }));
  }

  async delete(userId: String | Number, houseId: String | Number): Promise<void> {
    return await new Promise(resolve => resolve());
  }
}

interface SutType {
  sut: PurchaseController,
  serviceSut: PurchaseService,
}

const makeSut = (): SutType => {
  const serviceSut = new PurchaseService();
  const sut = new PurchaseController(serviceSut);
  return { sut, serviceSut };
};

class DatabaseError extends Error {
  typeError: string;

  constructor() {
    super();
    this.typeError = 'database';
  }
}

describe('Purchase Controller Unit - POST', () => {
  const httpRequest = { body: { ...purchaseDto, id: undefined } };

  test('Should return 400 if required fields are not provided', async() => {
    const { sut } = makeSut();
    const requiredFields = ['userId', 'houseId', 'date', 'description', 'value'];

    // Individual fields
    requiredFields.forEach(async field => {
      const httpRequest = { body: { ...purchaseDto, id: undefined } };
      httpRequest.body[field] = null;
      const httpResponse = await sut.post(httpRequest);
      expect(httpResponse).toEqual(missingFieldsError([field]));
    });

    // All fields
    const httpResponse = await sut.post({ body: {} });
    expect(httpResponse).toEqual(missingFieldsError(requiredFields));
  });

  test('Should return 500 service throws', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const httpResponse = await sut.post(httpRequest);
    expect(httpResponse).toEqual(serverError());
  });

  test('Should call service with correct data', async() => {
    const { sut, serviceSut } = makeSut();
    const serviceSpy = jest.spyOn(serviceSut, 'create');

    await sut.post(httpRequest);
    expect(serviceSpy).toHaveBeenCalledWith({ ...purchaseDto, id: undefined });
  });

  test('Should return 201', async() => {
    const { sut } = makeSut();

    const httpResponse = await sut.post(httpRequest);
    expect(httpResponse.status).toBe(201);
    expect(httpResponse.body).toEqual({ ...purchaseDto, value: Number(purchaseDto.value) / 100 });
  });
});

describe('Purchase Controller Unit - GET', () => {
  const { userId, houseId } = purchaseDto;
  const httpRequest = { body: { userId, houseId } };

  test('Should return 400 if required fields are not provided', async() => {
    const { sut } = makeSut();
    const requiredFields = ['userId', 'houseId'];

    // Individual fields
    requiredFields.forEach(async field => {
      const httpRequest = { body: { ...purchaseDto, id: undefined } };
      httpRequest.body[field] = null;
      const httpResponse = await sut.get(httpRequest);
      expect(httpResponse).toEqual(missingFieldsError([field]));
    });

    // All fields
    const httpResponse = await sut.get({ body: {} });
    expect(httpResponse).toEqual(missingFieldsError(requiredFields));
  });

  test('Should return 500 service throws', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const httpResponse = await sut.get(httpRequest);
    expect(httpResponse).toEqual(serverError());
  });

  test('Should call service with correct data', async() => {
    const { sut, serviceSut } = makeSut();
    const serviceSpy = jest.spyOn(serviceSut, 'get');

    await sut.get(httpRequest);
    expect(serviceSpy).toHaveBeenCalledWith(userId, houseId);
  });

  test('Should return 200', async() => {
    const { sut } = makeSut();

    const httpResponse = await sut.get(httpRequest);
    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual([{ ...purchaseDto, value: Number(purchaseDto.value) / 100 }]);
  });
});

describe('Purchase Controller Unit - PUT', () => {
  const updateDto = {
    id: purchaseDto.id,
    userId: purchaseDto.userId,
    houseId: purchaseDto.houseId,
    date: 1604534400000,
    description: 'Quitanda',
    value: 3500,
  };
  const httpRequest = { body: updateDto };

  test('Should return 400 if required fields are not provided', async() => {
    const { sut } = makeSut();
    const requiredFields = ['id', 'date', 'description', 'value', 'userId'];

    // Individual fields
    requiredFields.forEach(async field => {
      const httpRequest = { body: { ...updateDto } };
      httpRequest.body[field] = null;
      const httpResponse = await sut.put(httpRequest);
      expect(httpResponse).toEqual(missingFieldsError([field]));
    });

    // All fields
    const httpResponse = await sut.put({ body: {} });
    expect(httpResponse).toEqual(missingFieldsError(requiredFields));
  });

  test('Should return 500 service throws', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const httpResponse = await sut.put(httpRequest);
    expect(httpResponse).toEqual(serverError());
  });

  test('Should call service with correct data', async() => {
    const { sut, serviceSut } = makeSut();
    const serviceSpy = jest.spyOn(serviceSut, 'update');

    await sut.put(httpRequest);
    expect(serviceSpy).toHaveBeenCalledWith({ ...updateDto, houseId: undefined });
  });

  test('Should return 201', async() => {
    const { sut } = makeSut();

    const httpResponse = await sut.put(httpRequest);
    expect(httpResponse.status).toBe(201);
    expect(httpResponse.body).toEqual({ ...updateDto, value: Number(updateDto.value) / 100 });
  });

  test('Should return 401 if service throws database error', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new DatabaseError())));

    const httpResponse = await sut.put(httpRequest);
    expect(httpResponse).toEqual(notAuthorizedError());
  });
});

describe('Purchase Controller Unit - DELETE', () => {
  const { id, userId } = purchaseDto;

  const httpRequest = { body: { id, userId } };

  test('Should return 400 if required fields are not provided', async() => {
    const { sut } = makeSut();
    const requiredFields = ['id', 'userId'];

    // Individual fields
    requiredFields.forEach(async field => {
      const httpRequest = { body: { id, userId } };
      httpRequest.body[field] = null;
      const httpResponse = await sut.delete(httpRequest);
      expect(httpResponse).toEqual(missingFieldsError([field]));
    });

    // All fields
    const httpResponse = await sut.delete({ body: {} });
    expect(httpResponse).toEqual(missingFieldsError(requiredFields));
  });

  test('Should return 500 service throws', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'delete').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const httpResponse = await sut.delete(httpRequest);
    expect(httpResponse).toEqual(serverError());
  });

  test('Should call service with correct data', async() => {
    const { sut, serviceSut } = makeSut();
    const serviceSpy = jest.spyOn(serviceSut, 'delete');

    await sut.delete(httpRequest);
    expect(serviceSpy).toHaveBeenCalledWith(userId, id);
  });

  test('Should return 200', async() => {
    const { sut } = makeSut();

    const httpResponse = await sut.delete(httpRequest);
    expect(httpResponse.status).toBe(200);
  });

  test('Should return 401 if service throws database error', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'delete').mockReturnValueOnce(new Promise((resolve, reject) => reject(new DatabaseError())));

    const httpResponse = await sut.delete(httpRequest);
    expect(httpResponse).toEqual(notAuthorizedError());
  });
});
