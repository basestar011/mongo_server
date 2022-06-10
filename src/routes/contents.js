const express = require('express');
const router = express.Router();
const categoryService = require('../services/category');
const contentService = require('../services/content')
const { ErrorResponse, DataNotFoundError } = require('../utils/errors')

router
  // get all contents 
  .get('', async (req, res) => {
    const allContents = await contentService.getAll();
    return res.status(200).json(allContents);
  })
  // get content by code
  .get('/:code', async (req, res) => {
    const { code } = req.params;
  })
  // create content
  .post('', async (req, res) => {
    const { cg_code, title, detail } = req.body;
    const category = await categoryService.get(cg_code);
    if(!category) return res.status(400).send(new ErrorResponse(new DataNotFoundError('Category', { code: cg_code })))

    try {
      const contentCode = await contentService.create({ title, detail: detail || {}, cg_code });
      return res.status(201).json({ code: contentCode });
    } catch (error) {
      return res.status(500).send(new ErrorResponse(error));
    }
  })
  // update content
  .patch(':code', (req, res) => {

  })
  // delete content
  .delete(':code', (req, res) => {

  })

  module.exports = router;