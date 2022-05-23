const express = require('express');
const router = express.Router();
const categoryService = require('../services/category');
const contentService = require('../services/content')
const { ErrorResponse, DataNotFoundError } = require('../utils/errors')

router
  // get all categories
  .get('', async (req, res) => {
    const categories = await categoryService.getAll();
    return res.status(200).json(categories);
  })
  // create category
  .post('', async (req, res) => {
    const { name } = req.body;
    try {
      const code = await categoryService.create(name);
      return res.status(201).json(code);
    } catch (error) {
      return res.status(500).send(new ErrorResponse(error))
    }
  })
  // get category by code
  .get('/:code', async (req, res) => {
    const { code } = req.params;
    const category = await categoryService.get(code);
    return category ? res.status(200).json(category) :
      res.status(400).send(new ErrorResponse(new DataNotFoundError('Category', { code })));
  })
  // update category by code
  .patch('/:code', async (req, res) => {
    const { body: { name }, params: { code }} = req;
    const category = await categoryService.update(code, name);
    return category ? res.status(200).json(category) :
      res.status(400).send(new ErrorResponse(new DataNotFoundError('Category', { code })));
  })
  // delete category by code
  .delete('/:code', async (req, res) => {
    const { code } = req.params;
    const result = await categoryService.delete(code);
    return result ? res.sendStatus(200) :
      res.status(400).send(new ErrorResponse(new DataNotFoundError('Category', { code })));
  })
  // get content by category code
  .get('/:code/contents', async (req, res) => {
    const { code } = req.params;
    
  })
  // create content by category code
  .post('/:code/contents', async (req, res) => {
    const { code } = req.params;
    const category = await categoryService.get(code);
    if(!category) return res.status(400).send(new ErrorResponse(new DataNotFoundError('Category', { code, title: 'title', detail: { address: 'address', menu: ['1', '2', '3']} })))

    const { title, detail } = req.body;
    try {
      const contentCode = await contentService.create({ title, detail: detail || {}, cg_code: code });
      return res.sendStatus(201).json({ code: contentCode });
    } catch (error) {
      return res.status(500).send(new ErrorResponse(error));
    }
  })

module.exports = router;