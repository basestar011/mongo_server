const express = require('express');
const router = express.Router();
const { uploadFileToS3 } = require('../utils/aws')
const iconv = require('iconv-lite');
const categoryService = require('../services/category');
const contentService = require('../services/content')
const { ErrorResponse, DataNotFoundError } = require('../utils/errors')

router
  // get all categories
  .get('', async (req, res) => {
    const categories = await categoryService.getAll();

    return res.status(200).json(categories);
  })
  // get category by code
  .get('/:code', async (req, res) => {
    const { code } = req.params;
    const category = await categoryService.get(code);

    return res.status(200).json(category ?? {});
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
  // update category by code
  .patch('/:code', async (req, res) => {
    const { params: { code }, body: { name } } = req;
    try {
      const category = await categoryService.update(code, name);

      return res.status(200).json(category ?? {});
    } catch (error) {
      const errCode = error.name === 'DataMalformedError' ? 400 : 500;
      return res.status(errCode).send(new ErrorResponse(error));
    }
  })
  // delete category by code
  .delete('/:code', async (req, res) => {
    const { code } = req.params;
    try {
      const result = await categoryService.delete(code);

      return result ? res.sendStatus(204) :
        res.status(400).json(new ErrorResponse(new DataNotFoundError('Category', { code })));
    } catch (error) {
      const errCode = error.name === 'DataMalformedError' ? 400 : 500;
      return res.status(errCode).send(new ErrorResponse(error));
    }
  })
  // get contents by category code
  .get('/:code/contents', async (req, res) => {
    const { code } = req.params;
    try {
      const category = await categoryService.get(code);
      if(!category) return res.status(400).send(new ErrorResponse(new DataNotFoundError('Category', { code })));

      const contents = await contentService.getAllByCategoryCode(category.code);

      return res.status(200).json(contents);
    } catch (error) {
      const errCode = error.name === 'DataMalformedError' ? 400 : 500;
      return res.status(errCode).send(new ErrorResponse(error));
    }
  })
  // create content by category code
  .post('/:code/contents', uploadFileToS3('contents', 'images'), async (req, res) => {
    // 1. media파일 저장
    console.log(req.files);
    const savedFiles = req.files.map(file => {
      const filename = iconv.decode(file.originalname, 'UTF-8');
      const name = filename.substring(0, filename.lastIndexOf('.'));
      const type = filename.substring(filename.lastIndexOf('.'));
      return {
        id: file.key,
        name,
        type
      }
    })
    // 2. 컨텐츠 정보 저장
    return res.status(200).json(savedFiles);
    /*
    const { code: cg_code } = req.params;
    try {
      const category = await categoryService.get(cg_code);
      if(!category) return res.status(400).send(new ErrorResponse(new DataNotFoundError('Category', { code: cg_code })))

      const { title, detail } = req.body;
      const contentCode = await contentService.create({ title, detail: detail || {}, cg_code });

      return res.status(201).json({ code: contentCode });
    } catch (error) {
      const errCode = error.name === 'DataMalformedError' ? 400 : 500;
      return res.status(errCode).send(new ErrorResponse(error));
    }
    */
  })

module.exports = router;