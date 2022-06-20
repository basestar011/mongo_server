const { DataMalformedError } = require('../errors')

/**
 * 미디어 코드 체크
 * @param {string} id 
 * @returns {DataMalformedError | null}
 */
function checkId(id) {
  if(id === null || id === undefined) {
    return new DataMalformedError('id must not be empty');
  }

  return null;
}

module.exports = {
  checkId
}