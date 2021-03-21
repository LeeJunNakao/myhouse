import { Controller, HttpRequest, HttpResponse } from '../protocols';

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
}

export default GenericController;
