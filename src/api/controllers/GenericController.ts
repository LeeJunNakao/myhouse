import { Controller, HttpRequest, HttpResponse } from '../protocols';
import { MissingFieldsError } from '../errors';

const defaultResponse: HttpResponse = {
  status: 405,
  body: { message: 'Method not allowed' },
};

class GenericController implements Controller {
  async post(httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(defaultResponse));
  }

  async get(httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(defaultResponse));
  }

  async put(httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(defaultResponse));
  }

  async delete(httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(defaultResponse));
  }

  protected verifyRequiredFields(body: object, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(reqField => !body[reqField]);
    if (missingFields.length) throw new MissingFieldsError(missingFields);
  }
}

export default GenericController;
