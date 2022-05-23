const jwt = require('jsonwebtoken');
const jwtService = require('../services/jwt');
const { User } = require('../models');
const { ErrorResponse } = require('./errors');

/** auth check function */
module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth) {
    return res.sendStatus(401);
  } else {
    const [, token] = auth.split(' ');
    try {
      const { id, password } = jwtService.verifyToken(token);
      const user = await User.findOne({ id, password });
      return user ? next() : res.status(401).send(new ErrorResponse('Invalid token'));
    } catch (error) {
      const errCode = error.name === 'TokenExpiredError' ? 401 : 400;
      return res.status(errCode).send(new ErrorResponse(error));
    }
  }
}