const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const iconv = require('iconv-lite');
const bucket = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;

const s3 = new S3Client({ region });

/**
 * S3 특정 경로에 파일 업로드
 * - access key id와 secret key는 env에서 자동 로드(@aws-sdk/client-s3)
 * @param {string} path 폴더설정( /contents/파일명 -> 'contents', /contents/etc/파일명 -> 'contents/etc' )
 * @param {string} fieldName 필드명
 * @param {number} limit 최대 업로드 갯수. 기본 = Infinity
 * @returns 
 */
const uploadFileToS3 = (path, fieldName, limit = Infinity) => (req, res, next) => {
    console.log('start upload file to s3');

    const upload = multer({
        storage: multerS3({
            s3,
            bucket: bucket,
            metadata(req, file, callback) { // s3에 저장되는 파일의 metadata 설정
                callback(null, { fieldName: file.fieldname, fullName: iconv.decode(file.originalname, 'UTF-8') });
            },
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key(req, file, callback) { // s3에 저장되는 파일명
                callback(null, `${ path ? path + '/' : ''}${Date.now().toString()}`);
            },
        })
    }).array(fieldName, limit);

    return upload(req, res, (error) => {
        if(error instanceof multer.MulterError) {
            console.log('Multer Error!', error);
            return res.status(500).send('Multer Error!');
        } else if(error) {
            console.log('Internal Server Error!', error);
            return res.status(500).send('Internal Server Error!');
        }

        console.log('File Upload Complete!!');
        return next();
    })
}

module.exports = {
    uploadFileToS3
}

