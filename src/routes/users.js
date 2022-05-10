const express = require('express');
const { UserModel } = require('../models/UserModel')

const router = express.Router();

/** 회원 가입 */
router.post('', async (req, res) => {
  const { id, password } = req.body;
  try {
    const user = await UserModel.findOne({ id });
    if(user) return res.status(400).send({ message: 'User id already exists.' })

    const newUser = await UserModel.create({ id, password });
    res.status(201).send({ user: newUser.id });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;