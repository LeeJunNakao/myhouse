export class NotMatchedError extends Error {
  typeError: string;

  constructor() {
    super('Values provided dont match with database');
    this.name = 'NotMatchedError';
    this.typeError = 'database';
  }
}
