const options = require('../config/jwt');
const jwt = require('jsonwebtoken');

class JwtService {
  /**
   * @param {Object} jwt jsonwebtoken 라이브러리 
   * @param {string} secretKey token secretKey
   * @param {Object} options token options
   */
  constructor(jwt, options) {
    this.jwt = jwt;
    this.secretKey = process.env.SECRET_KEY;
    this.options = options;
  }

  /**
   * jwt token을 생성
   * @param {string | jwt.JwtPayload} payload 
   * @returns {string} token
   */
  generateToken(payload) {
    return this.jwt.sign(payload, this.secretKey, this.options);
  }

  /**
   * jwt token 검증 및 복호화
   * @param {string} token 
   * @returns {string | jwt.JwtPayload} payload 
   */
  verifyToken(token) {
    return jwt.verify(token, this.secretKey);
  }
}

module.exports = new JwtService(jwt, options);