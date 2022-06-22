const { Content } = require('../models');
const incrementCode = require('../utils/incrementCode');
const categoryValidator = require('../utils/validation/category')
const contentValidator = require('../utils/validation/content')
const mediaService = require('./media');

/**
 * @typedef {Object} Content
 * @property {number} code 컨텐츠 코드
 * @property {string} title 컨텐츠 제목
 * @property {object} detail 컨텐츠 상세
 * @property {Date} date 컨텐츠 날짜
 * @property {Array<Media>} images 컨텐츠 이미지
 * @property {number} cg_code 카테고리 코드
 * @property {Date} created 컨텐츠 생성시간
 * @property {Date} modified 컨텐츠 수정시간
 */

class ContentService {
  modelName = 'content'

  /**
   * @param {import('../models').Content} model - mongoose Content Model
   * @param {incrementCode} generateCode - code generator
   * @param {mediaService} mediaService
   */
  constructor(model, generateCode, mediaService) {
    this.model = model;
    this.generateCode = generateCode;
    this.mediaService = mediaService;
  }

  /**
   * 새 컨텐츠를 생성한다.
   * @param {Content} content 컨텐츠
   * @returns {Promise<Content>} 생성된 컨텐츠
   */
  async create(content) {
    /** 1. validation */
    const { title, cg_code, detail, date, images } = content;
    const validateResult = contentValidator.checkTitleAndCgCode(title, cg_code);
    if(validateResult) throw validateResult;
    /** 2. get content code : if content code exist, increment that and if not exist, create new one */
    const { code } = await this.generateCode(this.modelName);
    /** 3. create image media if present */
    const isImagePresent = images !== undefined && images.length > 0;
    const mediaArray = isImagePresent ? await this.mediaService.createAll(images) : [];
    /** 4. create category with next category code */
    const newContent = await this.model.create({
      code,
      title,
      cg_code,
      detail,
      date,
      images: mediaArray,
      created: new Date(),
      modified: new Date()
    });

    return {
      code: newContent.code,
      title: newContent.title,
      cg_code: newContent.cg_code,
      detail: newContent.detail,
      date: newContent.date,
      images: newContent.images,
      created: newContent.created,
      modified: newContent.modified
    };
  }

  /**
   * 모든 컨텐츠를 조회한다.
   * @returns {Promise<Array<Category>>}
   */
  async getAll() {
    // 1. 컨텐츠 조회
    const contents = await this.model.find().select('-__v -_id');

    // 2. 컨텐츠에 포함된 image media id -> media model로 변환하여 값 세팅
    const mediaPromise = []; // promise 배열
    const promiseIndex = []; // media 파일을 조회한 컨텐츠 인덱스를 저장(해당 인덱스에 media파일을 넣어주기 위함)
    // 2-1. 각 컨텐츠의 images에서 image id 배열로 media 데이터 조회
    contents.forEach((content, i) => {
      const images = content.images;
      if(images && images.length > 0) {
        mediaPromise.push(this.mediaService.getAll(images));
        promiseIndex.push(i);
      }
    });

    const results = await Promise.allSettled(mediaPromise);
    // 3. 조회한 media data를 컨텐츠의 images에 세팅 (reject된 경우는 로그 찍고 넘어감.)
    results.forEach((result, i) => {
      console.log(`Promise Result: ${result}`);
      result.status === 'fulfilled' && (contents[promiseIndex[i]].images = result.value);
      result.status === 'rejected' && console.error(`Image Load Error!! =>> Content ID [${contents[promiseIndex[i]].id}]`);
    });
    
    return contents;
  }

  /**
   * 특정 카테고리의 모든 컨텐츠를 조회한다.
   * @param {number} categoryCode 카테고리 code
   * @returns {Promise<Array<Content>>}
   * @throws DataMalformedError
   * */
  async getAllByCategoryCode(categoryCode) {
    const validateResult = categoryValidator.checkCode(categoryCode);
    if(validateResult) throw validateResult;
    const contents = await this.model.find({ cg_code: categoryCode }).select('-__v -_id')
    return contents;
  }

  /**
   * 특정 컨텐츠를 조회한다.
   * @param {number} code 컨텐츠 code
   * @returns {Promise<Content>} 컨텐츠
   */
  async get(code) {
    const validateResult = contentValidator.checkCode(code);
    if(validateResult) throw validateResult;
    const content = await this.model.findOne({ code }).select('-__v -_id');
    return content;
  }

  /**
   * 컨텐츠를 삭제한다.
   * @param {number} code 컨텐츠 code
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(code) {
    const deleted = await this.model.findOneAndDelete({ code })
    return deleted !== null;
  }
}

module.exports = new ContentService(Content, incrementCode, mediaService);