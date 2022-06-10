const { checkCode: checkCategoryCodeFn } = require('./category');
const { DataMalformedError } = require('../errors')

/**
 * 컨텐츠 코드 체크
 * @param {string | number} code
 * @returns {DataMalformedError | null}
 */
function checkCode(code) {
  const codeNum = Number(code);
  if(isNaN(codeNum)) return new DataMalformedError(`code param must be numeric`)
  return null;
}

/**
 * 컨텐츠 제목 체크
 * @param {string} title 
 * @returns {DataMalformedError | null}
 */
function checkTitle(title) {
  if(title === null || title === undefined) {
    return new DataMalformedError('title must not be empty')
  }
  const titleStr = String(title);
  // 공백포함 한글, 영문, 숫자, 특수문자 체크 2자이상 30자이내
  const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{} ]{1,30}$/;
  if(!regex.test(titleStr)) {
    return new DataMalformedError('title must consist of Korean, English, numbers, special character only and less than 30 character.')
  }

  return null;
}

/**
 * 컨텐츠의 카테고리 코드 체크
 * @param {string | number} categoryCode 
 * @returns {DataMalformedError | null}
 */
function checkCategoryCode(categoryCode) {
  return checkCategoryCodeFn(Number(categoryCode));
}

/**
 * 컨텐츠 디테일 체크
 * @param {Object} detail 
 */
function checkDetail(detail) {
  return null;
}

function checkAll(title, categoryCode, detail) {
  return checkTitle(title) || checkCategoryCode(categoryCode) || checkDetail(detail)
}

module.exports = {
  checkCode, checkTitle, checkCategoryCode, checkDetail, checkAll
}