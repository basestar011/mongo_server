const { Content } = require('../models');
const incrementCode = require('../utils/incrementCode');
const categoryValidator = require('../utils/validation/category')
const contentValidator = require('../utils/validation/content')
const mediaService = require('./media');

/**
 * @typedef {Object} Content
 * @property {number} code 컨텐츠 코드
 * @property {string} title 컨텐츠 제목
 * @property {object} detail 컨텐츠 상세
 * @property {Date} date 컨텐츠 날짜
 * @property {Array<Media>} images 컨텐츠 이미지
 * @property {number} cg_code 카테고리 코드
 * @property {Date} created 컨텐츠 생성시간
 * @property {Date} modified 컨텐츠 수정시간
 */

class ContentService {
  modelName = 'content'

  /**
   * @param {import('../models').Content} model - mongoose Content Model
   * @param {incrementCode} generateCode - code generator
   * @param {mediaService} mediaService
   */
  constructor(model, generateCode, mediaService) {
    this.model = model;
    this.generateCode = generateCode;
    this.mediaService = mediaService;
  }

  /**
   * 새 컨텐츠를 생성한다.
   * @param {Content} content 컨텐츠
   * @returns {Promise<number>} 생성된 카테고리 코드
   */
  async create(content) {
    /** 1. validation */
    const { title, cg_code, date, images } = content;
    const validateResult = contentValidator.checkTitleAndCgCode(title, cg_code);
    if(validateResult) throw validateResult;
    /** 2. get content code : if content code exist, increment that and if not exist, create new one */
    const { code } = await this.generateCode(this.modelName);
    /** 3. create image media if present */
    const isImagePresent = images !== undefined && images.length > 0;
    const mediaArray = isImagePresent ? await this.mediaService.createAll(images) : [];
    /** 4. create category with next category code */
    await this.model.create({
      code,
      title,
      cg_code,
      detail,
      date,
      images: mediaArray,
      created: new Date(),
      modified: new Date()
    });
    
    return code;
  }

  /**
   * 모든 컨텐츠를 조회한다.
   * @returns {Promise<Array<Category>>}
   */
  async getAll() {
    const contents = await this.model.find().select('-__v -_id');
    return contents;
  }

  /**
   * 특정 카테고리의 모든 컨텐츠를 조회한다.
   * @param {number} categoryCode 카테고리 code
   * @returns {Promise<Array<Content>>}
   * @throws DataMalformedError
   * */
  async getAllByCategoryCode(categoryCode) {
    const validateResult = categoryValidator.checkCode(categoryCode);
    if(validateResult) throw validateResult;
    const contents = await this.model.find({ cg_code: categoryCode }).select('-__v -_id')
    return contents;
  }

  /**
   * 특정 컨텐츠를 조회한다.
   * @param {number} code 컨텐츠 code
   * @returns {Promise<Content>} 컨텐츠
   */
  async get(code) {
    const validateResult = contentValidator.checkCode(code);
    if(validateResult) throw validateResult;
    const content = await this.model.findOne({ code }).select('-__v -_id');
    return content;
  }

  /**
   * 컨텐츠를 삭제한다.
   * @param {number} code 컨텐츠 code
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(code) {
    const deleted = await this.model.findOneAndDelete({ code })
    return deleted !== null;
  }
}

module.exports = new ContentService(Content, incrementCode);