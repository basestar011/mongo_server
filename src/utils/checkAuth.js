const jwt = require('jsonwebtoken');
const jwtService = require('../services/jwt');
const { User } = require('../models');

/** auth check function */
module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth) {
    return res.status(401).send('Unauthorized');
  } else {
    const [, token] = auth.split(' ');
    try {
      const { id, password } = jwtService.verifyToken(token);
      const user = await User.findOne({ id, password });

      return user ? next() : res.status(401).send('Invalid token');
    } catch (error) {
      if(error.name === 'TokenExpiredError') {
        return res.status(401).json({ error })
      } else {
        res.status(400).json({ error });
      }
    }
  }
}