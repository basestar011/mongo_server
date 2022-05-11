const { User } = require('../models');
const jwtService = require('./jwt');
const { UserLoginError } = require('../utils/errors')

class AuthService {
  /**
   * 
   * @param {Object} model - mongoose User Model
   * @param {Object} jwtService - jwt Service 
   */
  constructor(userModel, jwtService) {
    this.userModel = userModel;
    this.jwtService = jwtService;
  }

  /**
   * 로그인 후 토큰 발급
   * @param {string} id 로그인 id
   * @param {string} password 로그인 password
   * @returns {Promise<string>} jwt token
   * @throws UserLoginError - 사용자가 없거나 패스워드가 일치하지 않을때
   */
  async login(id, password) {
    /** 1. id로 사용자 검색 */
    const user = await this.userModel.findOne({ id });
    /** 2. 검색 결과 없으면 throw UserLoginError */
    if(!user) throw new UserLoginError(`Cannot find User: ${id}`);
    /** 3. 검색한 사용자의 password와 일치하지 않으면 throw UserLoginError */
    if(user.password !== password) throw new UserLoginError('Incorrect password');

    /** 4. 토큰 발급 */
    return this.jwtService.generateToken({ id, password });
  }
}

module.exports = new AuthService(User, jwtService);