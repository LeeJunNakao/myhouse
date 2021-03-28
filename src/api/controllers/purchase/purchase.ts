import Controller from '../GenericController';
import { HttpRequest, HttpResponse } from '../../protocols';
import { serverError, missingFieldsError } from '../../helper/handleError';
import { MissingFieldsError } from '../../errors';
import { PurchaseService } from '../../../domain/services/purchase';

export class PurchaseController extends Controller {
  private readonly service: PurchaseService;

  constructor(service: PurchaseService) {
    super();
    this.service = service;
  }

  async post(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;

      this.verifyRequiredFields(body, ['userId', 'houseId', 'date', 'description', 'value']);

      const purchase = await this.service.create({ userId: body.userId, houseId: body.houseId, date: body.date, description: body.description, value: body.value });

      return {
        status: 200,
        body: purchase,
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) return missingFieldsError(error.fields);
      return serverError();
    }
  }

  async get(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const { userId, houseId } = body;
      this.verifyRequiredFields(body, ['userId', 'houseId']);

      const purchases = await this.service.get(userId, houseId);

      return {
        status: 200,
        body: purchases,
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) return missingFieldsError(error.fields);
      return serverError();
    }
  }

  async put(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const { id, date, description, value } = body;
      this.verifyRequiredFields(body, ['id', 'date', 'description', 'value']);

      const purchase = await this.service.update({ id, date, description, value });

      return {
        status: 200,
        body: purchase,
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) return missingFieldsError(error.fields);
      return serverError();
    }
  }
}
