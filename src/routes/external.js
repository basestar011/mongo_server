const express = require('express');
const router = express.Router();
const { uploadFileToS3 } = require('../utils/aws')
const externalService = require('../services/external');

router
    // aws image upload (/contents 폴더)
    .post('/images', uploadFileToS3('contents', 'images'), (req, res) => {
        const uploadedFiles = req.files;
        const savedFiles = uploadedFiles.map(file => externalService.getFileInfos(file));
        return res.status(201).json(savedFiles);
    })

module.exports = router;