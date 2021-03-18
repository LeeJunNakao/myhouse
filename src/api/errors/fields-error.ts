export class MissingFieldsError extends Error {
  constructor(fields: string[]) {
    const errorMessage = `Missing required fields: ${fields}`;
    super(errorMessage);
    this.message = errorMessage;
  }
}
