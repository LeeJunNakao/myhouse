import Controller from '../GenericController';
import { HttpRequest, HttpResponse } from '../../protocols';
import { serverError, missingFieldsError } from '../../helper/handleError';
import { MissingFieldsError } from '../../errors';
import { HouseService } from '../../../domain/protocols/services';

export class HouseController extends Controller {
  private readonly service: HouseService;

  constructor(service: HouseService) {
    super();
    this.service = service;
  }

  async put(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const { id, name, members } = body;
      this.verifyRequiredFields(body, ['id', 'name', 'members']);
      const house = await this.service.updateHouse({ id, name, members });

      return {
        status: 200,
        body: house,
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) return missingFieldsError(error.fields);
      return serverError();
    }
  }

  async get(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { memberId } = httpRequest.body;

      if (!memberId) throw new MissingFieldsError(['memberId']);
      const houses = await this.service.getHouseByMemberId(memberId);

      return {
        status: 200,
        body: houses,
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) return missingFieldsError(error.fields);
      return serverError();
    }
  }

  async post(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const { name, members } = body;

      this.verifyRequiredFields(body, ['name', 'members']);

      const house = await this.service.createHouse({ name, members });

      return {
        status: 200,
        body: {
          id: house.id,
          name: house.name,
          members: house.members,
        },
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) return missingFieldsError(error.fields);
      return serverError();
    }
  }

  private verifyRequiredFields(body: object, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(reqField => !body[reqField]);
    if (missingFields.length) throw new MissingFieldsError(missingFields);
  }
}
