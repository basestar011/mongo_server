const express = require('express');
const router = express.Router();
const userService = require('../services/user');

/** 회원 가입 */
router.post('', async (req, res) => {
  const { id, password } = req.body;
  try {
    const newUser = await userService.create({ id, password });
    res.status(201).send({ user: newUser.id });
  } catch (error) {
    if(error.name === 'UserDuplicateError')
      return res.status(400).json({ error })
    else
      return res.status(500).json({ error });
  }
});

module.exports = router;