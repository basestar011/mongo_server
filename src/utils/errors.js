function getErrMsg(error) {
  if(error instanceof Error) {
    return error.message ?? error.message !== '' ? error.message : error.name;
  }
  return typeof error === 'string' ? error : 'Internal Server Error';
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
  getErrMsg, UserDuplicateError, UserLoginError, DataCreationError
}