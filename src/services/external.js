// file명 decoder
const iconv = require('iconv-lite');
const { deleteFileInS3 } = require('../utils/aws')

/**
 * multer-s3에서 넘겨주는 file object 일부
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
 * @typedef {import('./media.js').Media} Media
 */
class ExternalService {
  constructor(decoder) {
    this.decoder = decoder;
  }

  /**
   * s3에 저장된 file정보를 media model형식으로 parsing
   * @param {File} file
   * @return {Media} media model
   */
  parseFileInfos(file) {
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

  /**
   * S3에 저장된 파일 삭제
   * @param {Media} media 
   */
  async deleteFileFromS3(id) {
    const response = await deleteFileInS3(id);
    return response;
  }
}

module.exports = new ExternalService(iconv);