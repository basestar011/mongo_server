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

  /**
   * 기존 토큰을 검증 후 새 토큰 발급
   * @param {string} token 검증할 토큰
   * @returns {Promise<string | null>} jwt token or null
   */
  async verifyAndGenerateToken(token) {
    let payload;
    try {
      /** 1. token 검증 */
      payload = this.jwtService.verifyToken(token);
    } catch (error) {
      if(error.name === 'TokenExpiredError') {
        payload = this.jwtService.decodeToken(token);
      } else {
        /** 토큰 만료 에러 이외의 에러 발생 시 로그 찍고 null 반환 */
        console.error(error);
        return null;
      }
    }
    /** 2. 올바른 사용자의 정보인지 체크 */
    const { id, password } = payload;
    const user = await this.userModel.findOne({ id, password });
    /** 3. 검색 결과 없으면 null 반환 */
    if(!user) return null;
    /** 4. 새 토큰 발급 */
    return this.jwtService.generateToken({ id, password })
    
  }
}

module.exports = new AuthService(User, jwtService);