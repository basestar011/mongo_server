const { Category } = require('../models');
const { DataCreationError } = require('../utils/errors');
const incrementCode = require('../utils/incrementCode')
const { checkCode, checkName, checkCodeAndName } = require('../utils/validation/category')

/**
 * @typedef {Object} Category
 * @property {number} code 카테고리 코드
 * @property {string} name 카테고리 명
 * @property {number} parent 부모 카테고리
 */

class CategoryService {
  modelName = 'category'

  /**
   * @param {Object} model - mongoose Category Model
   * @param {Function} generateCode - Category 코드의 다음 숫자값 반환해주는 함수
   */
  constructor(model, generateCode) {
    this.model = model;
    this.generateCode = generateCode;
  }

  /**
   * 새 카테고리를 생성한다.
   * @param {string} name 카테고리명 
   * @returns {Promise<number>} 생성된 카테고리 코드
   * @throws DataMalformedError
   */
  async create(name) {
    /** 1. name validation */
    const validateResult = checkName(name);
    if(validateResult) throw validateResult;
    /** 2. get category code : if category code exist, increment that and if not exist, create new one */
    const { code } = await this.generateCode(this.modelName);
    /** 3. create category with next category code */
    await this.model.create({ code, name });
    return code;
  }

  /**
   * 모든 카테고리를 조회한다.
   * @returns {Promise<Array<Category>>}
   */
  async getAll() {
    const categories = await this.model.find().select('-__v -_id');
    return categories;
  }

  /**
   * 특정 카테고리를 조회한다.
   * @param {number} code 카테고리 code
   * @returns {Promise<Category>}
   * @throws DataMalformedError
   */
  async get(code) {
    /** 1. code validation */
    const validateResult = checkCode(code);
    if(validateResult) throw validateResult;
    /** 2. find category by code */
    const category = await this.model.findOne({ code }).select('-__v -_id')
    return category;
  }

  /**
   * 카테고리 명을 변경한다.
   * @param {number} code 카테고리 code
   * @param {string} name 카테고리 명
   * @returns {Promise<Category>} update된 카테고리
   * @throws DataMalformedError
   */
  async update(code, name) {
    /** 1. code, name validation */
    const validateResult = checkCodeAndName(code, name);
    if(validateResult) throw validateResult;
    /** 2. update category by code */
    const edited = await this.model
      .findOneAndUpdate({ code }, { name }, { new: true })
      .select('-__v -_id');
    return edited;
  }

  /**
   * 카테고리를 삭제한다.
   * @param {number} code 카테고리 code
   * @returns {Promise<Category>} 삭제한 카테고리
   * @throws DataMalformedError
   */
  async delete(code) {
    /** 1. code validation */
    const validateResult = checkCode(code);
    if(validateResult) throw validateResult;
    /** 2. delete category by code */
    const deleted = await this.model.findOneAndDelete({ code })
    return deleted;
  }
}

module.exports = new CategoryService(Category, incrementCode);