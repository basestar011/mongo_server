const jwt = require('jsonwebtoken');
const { User } = require('../models');

/** auth check function */
module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth) {
    return res.status(401).send('Unauthorized');
  } else {
    const token = auth.split(' ')[1];
    try {
      const { id, password, ...etc } = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({ id, password });

      return user ? next() : res.status(401).send('Invalid token');
    } catch (error) {
      res.status(400).send({[error.name]: error.message});
    }
  }
}