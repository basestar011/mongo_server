const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const iconv = require('iconv-lite');
const bucket = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;

const s3 = new S3Client({ region });
const uploadFileToS3 = multer({
    storage: multerS3({
        s3,
        bucket,
        metadata(req, file, callback) {
            callback(null, { fieldName: file.fieldname });
        },
        key(req, file, callback) {
            callback(null, Date.now().toString());
        },
    })
});

module.exports = {
    uploadFileToS3
}

