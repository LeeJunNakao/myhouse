export class ServerError extends Error {
  constructor() {
    super('an unexpected error has occurred');
    this.name = 'ServerError';
  }
}
