const { Content } = require('../models');
const { DataCreationError } = require('../utils/errors');
const incrementCode = require('../utils/incrementCode')

/**
 * @typedef {Object} Content
 * @property {number} code 콘텐츠 코드
 * @property {string} title 콘텐츠 제목
 * @property {object} detail 콘텐츠 상세
 * @property {number} cg_code 카테고리 코드
 */

class ContentService {
  modelName = 'content'

  /**
   * @param {Object} model - mongoose Content Model
   */
  constructor(model, generateCode) {
    this.model = model;
    this.generateCode = generateCode;
  }

  /**
   * 새 콘텐츠를 생성한다.
   * @param {Content} content 콘텐츠
   * @returns {Promise<number>} 생성된 카테고리 코드
   */
  async create(content) {
    /** 1. validation */
    const { title, detail, cg_code } = content;
    if(title === undefined || cg_code === undefined) throw new DataCreationError('title and Category code must not be undefined');
    /** 2. get content code : if content code exist, increment that and if not exist, create new one */
    const { code } = await this.generateCode(this.modelName);
    /** 3. create category with next category code */
    await this.model.create({ code, title, detail, cg_code });

    return code;
  }

  /**
   * 모든 카테고리를 조회한다.
   * @returns {Promise<Array<Category>>}
   */
  // async getAll() {
  //   const categories = await this.model.find().select('-__v -_id');
  //   return categories;
  // }

  /**
   * 특정 카테고리를 조회한다.
   * @param {string} code 카테고리 code
   * @returns {Promise<Category>}
   */
  // async get(code) {
  //   const category = await this.model.findOne({ code }).select('-__v -_id')
  //   return category;
  // }

  /**
   * 카테고리 명을 변경한다.
   * @param {string} code 카테고리 code
   * @param {string} name 카테고리 명
   * @returns {Promise<Category>} update된 카테고리
   */
  // async update(code, name) {
  //   const edited = await this.model
  //     .findOneAndUpdate({ code }, { name }, { new: true })
  //     .select('-__v -_id');
  //   return edited;
  // }

  /**
   * 카테고리를 삭제한다.
   * @param {string} code 카테고리 code
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  // async delete(code) {
  //   const deleted = await this.model.findOneAndDelete({ code })
  //   return deleted !== null;
  // }
}

module.exports = new ContentService(Content, incrementCode);