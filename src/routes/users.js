const express = require('express');
const router = express.Router();
const userService = require('../services/user');
const { ErrorResponse } = require('../utils/errors');

/** 회원 가입 */
router.post('', async (req, res) => {
  const { id, password } = req.body;
  if(!id || !password) return res.status(400).json(new ErrorResponse('Id and Password must not be null'))
  try {
    const newUser = await userService.create({ id, password });
    res.status(201).send(newUser);
  } catch (error) {
    const errCode = error.name === 'UserDuplicateError' ? 400 : 500;
    return res.status(errCode).send(new ErrorResponse(error))
  }
});

module.exports = router;