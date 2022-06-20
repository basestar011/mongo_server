const mongoose = require('mongoose');

/**
 * @typedef {Object} Media
 * @property {string} id s3에 보여지는 파일명(폴더경로제외한 문자)
 * @property {string} name 업로드한 파일명(확장자 제외)
 * @property {string} path s3 폴더경로
 * @property {string} srclink image src에 사용할 수 있는 s3 이미지 로드 fullpath
 * @property {string} type 확장자명(.포함)
 * @property {number} size 파일 크기
 */

const mediaSchema = mongoose.Schema({
  id: String, // s3 key
  name: String, // file name
  path: String, // file path(s3 folder)
  srclink: String, // file src link
  type: String, // file extension
  size: Number // file size
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = { Media };