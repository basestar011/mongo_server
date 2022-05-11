const express = require('express');
const router = express.Router();
const authService = require('../services/auth');

/** 로그인 요청 */
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  try {
    const token = await authService.login(id, password);
    return res.status(201).json({ token });
  } catch (error) {
    if(error.name === 'UserLoginError')
      return res.status(401).json({ error });
    else res.status(500).json({ error })
  }
})

module.exports = router;