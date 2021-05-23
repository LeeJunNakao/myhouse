import { HttpResponse } from '../protocols';
import { ServerError, MissingFieldsError, NotAuthorizedError } from '../errors';

export const serverError = (): HttpResponse => ({
  status: 500,
  body: new ServerError(),
});

export const missingFieldsError = (fields: string[]): HttpResponse => ({
  status: 400,
  body: new MissingFieldsError(fields),
});

export const notAuthorizedError = (): HttpResponse => ({
  status: 401,
  body: new NotAuthorizedError(),
});
