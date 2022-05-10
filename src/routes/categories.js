const express = require('express');
const { CategoryModel, CodeModel } = require('../models');
const getNextSequence = require('../utils/getNextSequence').getNextSequence;

const router = express.Router();

router
  // create Category
  .post('', async (req, res) => {
    const { name } = req.body;
    console.log('create category: ' + name);
    try {
      /** 1. increment category code */
      const categoryCode = await CodeModel.findOne({ model: 'category' });
      const code = getNextSequence(categoryCode.code);
      await CodeModel.updateOne({ model: 'category' }, { code });

      /** 2. create category with next category code */
      await CategoryModel.create({ code, name });

      res.status(201).json({ code, name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ [error.name]: error.message });
    }
  })
  // get Category by code
  .get('/:code', (req, res) => {
    console.log(req.params);
    res.status(200).send('request category');
  })

module.exports = router;