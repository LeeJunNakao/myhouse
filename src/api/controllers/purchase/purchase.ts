import Controller from '../GenericController';
import { HttpRequest, HttpResponse } from '../../protocols';
import { serverError, missingFieldsError, notAuthorizedError } from '../../helper/handleError';
import { MissingFieldsError } from '../../errors';
import { PurchaseService } from '../../../domain/protocols/services';

export class PurchaseController extends Controller {
  private readonly service: PurchaseService;

  constructor(service: PurchaseService) {
    super();
    this.service = service;
  }

  async post(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const requiredFields = ['userId', 'houseId', 'date', 'description', 'value'];

      this.verifyRequiredFields(body, requiredFields);
      const purchase = await this.service.create({ userId: body.userId, houseId: body.houseId, date: body.date, description: body.description, value: body.value });

      return {
        status: 201,
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
      const requiredFields = ['userId', 'houseId'];

      this.verifyRequiredFields(body, requiredFields);
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
      const { id, date, description, value, userId } = body;
      const requiredFields = ['id', 'date', 'description', 'value', 'userId'];

      this.verifyRequiredFields(body, requiredFields);
      const purchase = await this.service.update({ id, date, description, value, userId });

      return {
        status: 201,
        body: purchase,
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) return missingFieldsError(error.fields);
      if (error.typeError === 'database') return notAuthorizedError();
      return serverError();
    }
  }

  async delete(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const { id, userId } = body;
      const requiredFields = ['id', 'userId'];

      this.verifyRequiredFields(body, requiredFields);
      await this.service.delete(userId, id);

      return {
        status: 200,
        body: null,
      };
    } catch (error) {
      if (error instanceof MissingFieldsError) return missingFieldsError(error.fields);
      if (error.typeError === 'database') return notAuthorizedError();
      return serverError();
    }
  }
}
