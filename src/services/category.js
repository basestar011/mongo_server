const { Category } = require('../models')
const incrementCode = require('../utils/incrementCode')

/**
 * @typedef {Object} Category
 * @property {string} _id 고유한 id
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

    return newCategory;
  }
}

module.exports = new CategoryService(Category, incrementCode);