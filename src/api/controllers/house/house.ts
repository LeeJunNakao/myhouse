import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { serverError, missingFieldsError } from '../../helper/handleError';
import { MissingFieldsError } from '../../errors';
import { HouseService } from '../../../domain/protocols/services';

export class HouseController implements Controller {
  private readonly service: HouseService;

  constructor(service: HouseService) {
    this.service = service;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const { name, members } = body;

      this.verifyRequiredFields(body);

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

  verifyRequiredFields(body: object): void {
    const requiredFields = ['name', 'members'];
    const missingFields = requiredFields.filter(reqField => !body[reqField]);
    if (missingFields.length) throw new MissingFieldsError(missingFields);
  }
}
