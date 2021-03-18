import { HttpResponse } from '../protocols';
import { ServerError, MissingFieldsError } from '../errors';

export const serverError = (): HttpResponse => ({
  status: 500,
  body: new ServerError(),
});

export const missingFieldsError = (fields: string[]): HttpResponse => ({
  status: 400,
  body: new MissingFieldsError(fields),
});
