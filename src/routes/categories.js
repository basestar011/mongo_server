const express = require('express');
const router = express.Router();
const categoryService = require('../services/category');

router
  // create Category
  .post('', async (req, res) => {
    const { name } = req.body;
    try {
      const newCategory = await categoryService.create(name);
      return res.status(201).json({ category: newCategory });
    } catch (error) {
      return res.status(500).json({ error });
    }
  })
  // get Category by code
  .get('/:code', (req, res) => {
    const { code } = req.params;

    res.status(200).send('request category');
  })

module.exports = router;