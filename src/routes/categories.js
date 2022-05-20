const express = require('express');
const router = express.Router();
const categoryService = require('../services/category');
const { getErrMsg } = require('../utils/errors')

router
  // get all categories
  .get('', async (req, res) => {
    const categories = await categoryService.getAll();
    return res.status(200).json(categories);
  })
  // create Category
  .post('', async (req, res) => {
    const { name } = req.body;
    try {
      const code = await categoryService.create(name);
      return res.status(201).json(code);
    } catch (error) {
      return res.status(500).send(getErrMsg(error))
    }
  })
  // get category by code
  .get('/:code', async (req, res) => {
    const { code } = req.params;
    const category = await categoryService.get(code);
    return category ? res.status(200).json(category) : res.status(400).send(getErrMsg(`${code} category not found`));
  })
  .patch('/:code', async (req, res) => {
    const { body: { name }, params: { code }} = req;
    const category = await categoryService.update(code, name);
    return category ? res.status(200).json(category) : res.status(400).send(getErrMsg(`${code} category not found`));
  })
  .delete('/:code', async (req, res) => {
    const { code } = req.params;
    const result = await categoryService.delete(code);
    return result ? res.sendStatus(200) : res.status(400).send(getErrMsg(`${code} category not found`));
  })

module.exports = router;