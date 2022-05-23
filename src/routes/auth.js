const express = require('express');
const router = express.Router();
const authService = require('../services/auth');
const { ErrorResponse } = require('../utils/errors');

/** 로그인 요청 */
router
  // get New Token by old token
  .get('', async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.sendStatus(401);
    const token = auth.split(' ')[1];
    const newToken = await authService.verifyAndGenerateToken(token);
    return newToken ? res.status(200).send(newToken) : res.sendStatus(401);
  })
  // login
  .post('/login', async (req, res) => {
    const { id, password } = req.body;
    try {
      const token = await authService.login(id, password);
      return res.status(201).send(token);
    } catch (error) {
      const errCode = error.name === 'UserLoginError' ? 401 : 500;
      return res.status(errCode).send(new ErrorResponse(error))
    }
  })

module.exports = router;