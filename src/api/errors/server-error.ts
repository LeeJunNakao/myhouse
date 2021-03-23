export class ServerError extends Error {
  constructor() {
    super('an unexpected error has occurred');
    this.name = 'ServerError';
  }
}

export class NotAuthorizedError extends Error {
  constructor() {
    super('User not authorized to execute this action');
    this.name = 'NotAuthorizedError';
    this.message = 'User is not authorized to execute this action';
  }
}
