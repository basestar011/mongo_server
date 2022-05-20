const express = require('express');
const router = express.Router();
const userService = require('../services/user');
const { getErrMsg } = require('../utils/errors');

/** 회원 가입 */
router.post('', async (req, res) => {
  const { id, password } = req.body;
  try {
    const newUser = await userService.create({ id, password });
    res.status(201).send(newUser);
  } catch (error) {
    const errCode = error.name === 'UserDuplicateError' ? 400 : 500;
    return res.status(errCode).send(getErrMsg(error))
  }
});

module.exports = router;