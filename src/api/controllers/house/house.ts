import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { serverError, missingFieldsError } from '../../helper/handleError';
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

      const missingFields = this.verifyRequiredFields(body);
      if (missingFields.length) return missingFieldsError(missingFields);

      const house = await this.service.createHouse({ name, members });

      return {
        status: 200,
        body: {
          id: house.id,
          name: house.id,
          members: house.id,
        },
      };
    } catch (error) {
      return serverError();
    }
  }

  verifyRequiredFields(body: object): string[] {
    const requiredFields = ['name', 'members'];
    const fields = Object.keys(body);
    return requiredFields.filter(reqField => fields.includes(reqField));
  }
}
