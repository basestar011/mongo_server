const { Media } = require('../models');
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
   */
  async get(id) {
    const validateResult = mediaValidator.checkId(id);
    if(validateResult) throw validateResult;
    const media = await this.model.findOne({ id }).select('-__v -_id');
    return media;
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