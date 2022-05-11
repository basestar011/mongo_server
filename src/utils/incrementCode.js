const { Code } = require('../models')

/**
 * CodeModel에서 특정 model의 code 값을 1 증가시키고,
 * 증가된 값을 가져온다.
 * @param {string} modelName 
 * @returns {Query} { code }
 */
function incrementCode(modelName) {
  return Code.findOneAndUpdate(
    { model: modelName },
    { $inc: { code: 1 }, $setOnInsert: { model: modelName } },
    { new: true, upsert: true }
  ).select('-_id code');
};

module.exports = incrementCode;