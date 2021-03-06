import Controller from '../GenericController';
import { HttpRequest, HttpResponse } from '../../protocols';
import {
  serverError,
  missingFieldsError,
  notAuthorizedError
} from '../../helper/handleError';
import { MissingFieldsError } from '../../errors';
import { HouseService } from '../../../domain/protocols/services';

export class HouseController extends Controller {
  private readonly service: HouseService;

  constructor(service: HouseService) {
    super();
    this.service = service;
  }

  async delete(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id, userId } = httpRequest.body;

      await this.service.deleteHouse(id, userId);

      return {
        status: 200,
        body: null,
      };
    } catch {
      return serverError();
    }
  }

  async put(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const { id, name, userId, members } = body;
      this.verifyRequiredFields(body, ['id', 'name']);

      const house = await this.service.updateHouse({
        id,
        name,
        userId,
        members,
      });

      return {
        status: 200,
        body: house,
      };
    } catch (error) {
      if (error.typeError === 'database') return notAuthorizedError();
      if (error instanceof MissingFieldsError) { return missingFieldsError(error.fields); }
      return serverError();
    }
  }

  async get(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.body;

      this.verifyUserId(httpRequest.body);
      const houses = await this.service.getHouseByUserId(userId);

      return {
        status: 200,
        body: houses,
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) { return missingFieldsError(error.fields); }
      return serverError();
    }
  }

  async post(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const { name, userId } = body;
      const members = this.parseMembers(body);

      this.verifyUserId(body);
      this.verifyRequiredFields(body, ['name']);

      const house = await this.service.createHouse({ name, members, userId });

      return {
        status: 200,
        body: {
          id: house.id,
          name: house.name,
          members: house.members,
        },
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) { return missingFieldsError(error.fields); }
      return serverError();
    }
  }

  private parseMembers(body: any): number[] | string[] {
    const { members, userId } = body;

    if (Array.isArray(members)) {
      return members.includes(userId) ? members : [...members, userId];
    }
    return [userId];
  }

  private verifyUserId(body: any): void {
    const { userId } = body;
    if (!userId) throw new Error();
  }
}
