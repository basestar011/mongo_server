class ErrorResponse {
  constructor(error) {
    if(error instanceof Error) {
      this.name = error.name;
      this.message = error.message;
      // this.stack = error.stack;
    }
    else if(Array.isArray(error)) {
      [this.name, this.message] = error;
    }
    else if(typeof error === 'string') {
      this.name = 'Error';
      this.message = error;
    } else {
      this.name = 'Error';
      this.message = 'Internal Server Error';
    }
  }
}

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

class DataCreationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataCreationError'
  }
}

module.exports = {
  ErrorResponse, UserDuplicateError, UserLoginError, DataCreationError
}