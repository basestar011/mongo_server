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
    super(message || 'Duplicate User');
    this.name = 'UserDuplicateError';
  }
}

class UserLoginError extends Error {
  constructor(message) {
    super(message || 'Error occurred while logging in user');
    this.name = 'UserLoginError';
  }
}

class DataCreationError extends Error {
  constructor(message) {
    super(message || 'Error occurred while creating Data');
    this.name = 'DataCreationError'
  }
}

class DataNotFoundError extends Error {
  /**
   * @param {string} type 데이터 타입
   * @param {object} value 데이터 필드값 ex) code
   */
  constructor(type, value) {
    const detail = value && JSON.stringify(value);
    super(`${type ? type + ' ' : ''}Data Not Found ${detail ? ': ' + detail : ''}`);
    this.name = 'DataNotFoundError';
  }
}

class DataMalformedError extends Error {
  constructor(message) {
    super(message || 'Data is malformed');
    this.name = 'DataMalformedError'
  }
}

module.exports = {
  ErrorResponse, UserDuplicateError, UserLoginError, DataCreationError, DataNotFoundError, DataMalformedError
}