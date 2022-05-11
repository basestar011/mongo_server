const express = require('express');
const router = express.Router();

const categoryService = require('../services/category');

router
  // create Category
  .post('', async (req, res) => {
    const { name } = req.body;
    try {
      const newCategory = await categoryService.create(name);
      res.status(201).json({ category: newCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ [error.name]: error.message });
    }
  })
  // get Category by code
  .get('/:code', (req, res) => {
    const { code } = req.params;

    res.status(200).send('request category');
  })

module.exports = router;