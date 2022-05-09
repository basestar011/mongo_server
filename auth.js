const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { id, password } = req.body;
  if(id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
    const { SECRET_KEY, ALGORITHM, EXPIRES_IN, ISSUER } = process.env;
    const token = jwt.sign({ id, password }, SECRET_KEY, {
      algorithm: ALGORITHM,
      expiresIn: EXPIRES_IN,
      issuer: ISSUER
    });
    res.status(201).json({ token });
  } else {
    res.status(401).send('Invalid id, password');
  }
})

module.exports = router;