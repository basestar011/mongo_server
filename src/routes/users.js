const express = require('express');
const { User } = require('../models')

const router = express.Router();

/** 회원 가입 */
router.post('', async (req, res) => {
  const { id, password } = req.body;
  try {
    const user = await User.findOne({ id });
    if(user) return res.status(400).send({ message: 'User id already exists.' })

    const newUser = await User.create({ id, password });
    res.status(201).send({ user: newUser.id });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;