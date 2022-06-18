const iconv = require('iconv-lite');

/**
 * @typedef {Object} File
 * @property {string} fieldname
 * @property {string} originalname
 * @property {string} encoding
 * @property {string} mimetype
 * @property {number} size
 * @property {string} bucket
 * @property {string} key
 * @property {string} acl
 * @property {string} contentType
 * @property {string} contentDisposition
 * @property {string} contentEncoding
 * @property {string} storageClass
 * @property {Object} metadata
 * @property {string} location
 * @property {string} etag
 */

/**
 * @typedef {Object} Media
 * @property {string} id s3에 보여지는 파일명(폴더경로제외한 문자)
 * @property {string} name 업로드한 파일명(확장자 제외)
 * @property {string} path s3 폴더경로
 * @property {string} srclink image src에 사용할 수 있는 s3 이미지 로드 fullpath
 * @property {string} type 확장자명(.포함)
 * @property {number} size 파일 크기
 */
class ExternalService {
  constructor(decoder) {
    this.decoder = decoder;
  }

  /**
   * 
   * @param {File} file
   * @return {Media} media model
   */
  getFileInfos(file) {
    const originalName = this.decoder.decode(file.originalname, 'UTF-8');
    return {
        id: file.key.substring(file.key.lastIndexOf('/') + 1),
        name: originalName.substring(0, originalName.lastIndexOf('.')),
        path: file.location.split('/').splice(3).reverse().splice(1).reverse().join('/'),
        srclink: file.location,
        type: originalName.substring(originalName.lastIndexOf('.')),
        size: file.size
    }
  }
}

module.exports = new ExternalService(iconv);