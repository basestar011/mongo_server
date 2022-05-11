const { User } = require('../models');
const { UserDuplicateError } = require('../utils/errors')

/**
 * @typedef {Object} User
 * @property {string} id User id
 * @property {string} password User password
 */

class UserService {
  /**
   * @param {Object} model - mongoose User Model
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * 새 User를 생성한다.
   * @param {User} user 
   * @returns {Promise<User>} 생성된 User 객체
   * @throws UserDuplicateError : id가 이미 존재할 때 에러
   */
  async create(user) {
    const { id, password } = user;
    /** 1. check existance of user with this id */
    const isExist = await this.isUserExist(id);
    /** 2. if exist throw UserDuplicateError */
    if(isExist) throw new UserDuplicateError('User id already exists.');
    /** 3. if not exist, create new user */
    const newUser = await this.model.create({ id, password });
    return newUser;
  }

  /**
   * User 존재 여부
   * @param {string} id 찾는 user id
   * @returns {boolean} User 존재 여부
   */
  async isUserExist(id) {
    const user = await this.model.findOne({ id });
    return user !== null;
  }
}

module.exports = new UserService(User);