export class AuthorizationError extends Error {
  constructor() {
    super('Authorization Failed');
  }
}
export class SessionExpiredError extends Error {
  constructor() {
    super('Session Expired');
  }
}
