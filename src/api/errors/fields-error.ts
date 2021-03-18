export class MissingFieldsError extends Error {
  fields: string[];

  constructor(fields: string[]) {
    const errorMessage = `Missing required fields: ${fields}`;
    super(errorMessage);
    this.message = errorMessage;
    this.fields = fields;
  }
}
