const { Media } = require('../models');
const { DataMalformedError } = require('../utils/errors');
const mediaValidator = require('../utils/validation/media')

class MediaService {
  /**
   * @param {import('../models').Media} model 
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * media 생성
   * @param {Media} media
   * @return {Promise<string>}
   */
  async create(media) {
    // validate 필요한가?
    await this.model.create(media);
    return media.id;
  }

  /**
   * 한번에 여러 media 생성
   * @param {Array<Object>} medias 
   * @return {Promise<Array<string>>}
   */
  async createAll(medias) {
    const mediaPromise = [];
    medias.forEach(media => mediaPromise.push(this.create(media)));
    const mediaIds = await Promise.all(mediaPromise);
    return mediaIds;
  }

  /**
   * media 조회
   * @param {string} id 
   * @return {Promise<Media>}
   */
  async get(id) {
    const validateResult = mediaValidator.checkId(id);
    if(validateResult) throw validateResult;
    const media = await this.model.findOne({ id }).select('-__v -_id');
    return media;
  }

  /**
   * 여러 개의 media 조회
   * @param {string[]} ids
   * @return {Promise<Media[]>}
   */
  async getAll(ids) {
    const validateResult = ids
      .map(id => mediaValidator.checkId(id))
      .find(result => result !== null && result instanceof DataMalformedError);
    if(validateResult) throw validateResult;
    const medias = await this.model
      .find()
      .where('id').in(ids)
      .select('-__v -_id');
    return medias;
  }

  /**
   * media 삭제
   * @param {string} id 
   * @returns {boolean}
   */
  async delete(id) {
    const deleted = await this.model.findOneAndDelete({ id })
    return deleted !== null;
  }
}

module.exports = new MediaService(Media);