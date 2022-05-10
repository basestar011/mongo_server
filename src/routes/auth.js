const express = require('express');
const { UserModel } = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const router = express.Router();

/** 로그인 요청 */
router.post('/login', async (req, res) => {
  const { id, password } = req.body;

  // user 검증
  const user = await UserModel.findOne({ id });
  if(!user) return res.status(401).send({ message: `Cannot find User: ${id}` });
  if(user.password !== password) return res.status(401).send({ message: 'Incorrect password' });

  // token 발급
  const token = jwt.sign({ id, password }, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "30m",
    issuer: "mongo_server"
  });

  res.status(201).json({ token });
})

module.exports = router;