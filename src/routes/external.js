const express = require('express');
const router = express.Router();
const { uploadFileToS3 } = require('../utils/aws')
const externalService = require('../services/external');
const mediaService = require('../services/media');
const { ErrorResponse } = require('../utils/errors')

router
  // aws image upload (/contents 폴더)
  .post('/images', uploadFileToS3('contents', 'images'), (req, res) => {
    const uploadedFiles = req.files ?? [];
    const savedFiles = uploadedFiles.map(file => externalService.parseFileInfos(file));
    return res.status(201).json(savedFiles);
  })
  // aws image delete (path 포함된 id)
  .delete('/images/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const response = await externalService.deleteFileFromS3(id);
      console.log('delete Image', response);
      return response.$metadata.httpStatusCode === 204 ?
        res.sendStatus(204) : res.status(500).json(new ErrorResponse('Error while delete File From S3'));
    } catch (error) {
      console.log('Error while delete Image', error);
      return res.status(500).json(new ErrorResponse(error));
    }
  })

module.exports = router;