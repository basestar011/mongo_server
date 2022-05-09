const jwt = require('jsonwebtoken');

/** auth check function */
exports.checkAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth) {
    res.status(401).send('Unauthorized');
  } else {
    const token = auth.split(' ')[1];
    try {
      const { id, password, ...etc } = jwt.verify(token, process.env.SECRET_KEY);
      if(id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
        next();
      }
      else {
        res.status(401).send('Invalid token');
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({[error.name]: error.message});
    }
  }
}