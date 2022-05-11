const { Category } = require('../models')
const incrementCode = require('../utils/incrementCode')

/**
 * @typedef {Object} Category
 * @property {number} code 카테고리 코드
 * @property {string} name 카테고리 명
 */

class CategoryService {
  modelName = 'category'

  /**
   * @param {Object} model - mongoose Category Model
   * @param {Function} codeGenerator - Category 코드의 다음 숫자값 반환해주는 함수
   */
  constructor(model, codeGenerator) {
    this.model = model;
    this.codeGenerator = codeGenerator;
  }

  /**
   * 새 카테고리를 생성한다.
   * @param {string} name 카테고리명 
   * @returns {Promise<Category>} 생성된 카테고리 객체
   */
  async create(name) {
    /** 1. if exist, increment category code and if not exist, create one */
    const { code } = await this.codeGenerator(this.modelName);
    /** 2. create category with next category code */
    const newCategory = await this.model.create({ code, name });

    return { code: newCategory.code, name: newCategory.name };
  }

  /**
   * 모든 카테고리를 조회한다.
   * @returns {Promise<Array<Category>>}
   */
  async getAll() {
    const categories = await this.model.find().select('-_id code name');
    return categories;
  }

  /**
   * 특정 카테고리를 조회한다.
   * @param {string} code 카테고리 code
   * @returns {Promise<Category>}
   */
  async get(code) {
    const category = await this.model.findOne({ code }).select('-_id code name')
    return category;
  }

  /**
   * 카테고리 명을 변경한다.
   * @param {string} code 카테고리 code
   * @param {string} name 카테고리 명
   * @returns {Promise<Category>} update된 카테고리
   */
  async update(code, name) {
    const edited = await this.model
      .findOneAndUpdate({ code }, { name }, { new: true })
      .select('-_id code name');
    return edited;
  }

  /**
   * 카테고리를 삭제한다.
   * @param {string} code 카테고리 code
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(code) {
    const deleted = await this.model.findOneAndDelete({ code })
    return deleted !== null;
  }
}

module.exports = new CategoryService(Category, incrementCode);