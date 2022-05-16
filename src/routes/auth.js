const express = require('express');
const router = express.Router();
const authService = require('../services/auth');

/** 로그인 요청 */
router
  // get New Token by old token
  .get('', async (req, res) => {
    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];
    const newToken = await authService.verifyAndGenerateToken(token);
    return newToken ? res.status(200).send(newToken) : res.sendStatus(401);
  })
  // login
  .post('/login', async (req, res) => {
    const { id, password } = req.body;
    try {
      const token = await authService.login(id, password);
      return res.status(201).json(token);
    } catch (error) {
      if(error.name === 'UserLoginError')
        return res.status(401).json({ error });
      else
        return res.status(500).json({ error })
    }
  })

module.exports = router;