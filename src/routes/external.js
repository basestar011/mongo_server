const express = require('express');
const router = express.Router();
const { uploadFileToS3 } = require('../utils/aws')
const iconv = require('iconv-lite');

router
    // aws image upload
    .post('/images', uploadFileToS3('contents', 'images'), (req, res) => {
        const uploadedFiles = req.files;
        const savedFiles = uploadedFiles.map(file => {
            console.log(file);
            const originalName = iconv.decode(file.originalname, 'UTF-8');
            return {
                id: file.key.substring(file.key.lastIndexOf('/') + 1), // s3에 보여지는 파일명(폴더경로제외한 문자)
                name: originalName.substring(0, originalName.lastIndexOf('.')), // 업로드한 파일명(확장자 제외)
                path: file.location.split('/').splice(3).reverse().splice(1).reverse().join('/'), // s3 폴더경로
                srclink: file.location, // image src에 사용할 수 있는 s3 이미지 로드 fullpath
                type: originalName.substring(originalName.lastIndexOf('.')), // 확장자명(.포함)
                size: file.size // 파일 크기
            }
        })
        return res.status(201).json(savedFiles);
    })

module.exports = router;