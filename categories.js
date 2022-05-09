const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  console.log(req.params);
  res.status(200).send('request category');
})

module.exports = router;