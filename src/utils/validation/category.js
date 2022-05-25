const { DataMalformedError } = require('../errors')

/**
 * 카테고리 코드 체크
 * @param {string} code 
 * @returns {DataMalformedError | null}
 */
function checkCode(code) {
  if(code === null || code === undefined) {
    return new DataMalformedError('code must not be empty')
  }
  const codeNum = Number(code);
  if(Number.isNaN(codeNum)) return new DataMalformedError(`code param must be numeric`);
  return null;
}

/**
 * 카테고리 명 체크
 * @param {string} name 
 * @returns {DataMalformedError | null}
 */
function checkName(name) {
  if(name === null || name === undefined) {
    return new DataMalformedError('name must not be empty')
  }
  const nameStr = String(name);
  const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
  if(!regex.test(nameStr)) {
    return new DataMalformedError('name must consist of Korean, English and numbers only')
  }

  if(nameStr.length < 2 || nameStr.length > 10) {
    return new DataMalformedError('name must be more than 2 characters and less than 10 characters');
  }
  return null;
}

/**
 * 카테고리 코드, 카테고리 명 체크
 * @param {string} code 
 * @param {string} name 
 * @returns {DataMalformedError | null}
 */
function checkCodeAndName(code, name) {
  return checkCode(code) || checkName(name);
}

export {
  checkCode, checkName, checkCodeAndName
}