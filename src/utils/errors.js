class UserDuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserDuplicateError';
  }
}

class UserLoginError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserLoginError';
  }
}

module.exports = {
  UserDuplicateError, UserLoginError
}