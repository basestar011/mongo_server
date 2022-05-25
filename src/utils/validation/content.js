const { checkCode } = require('./category');

function checkTitle(title) {

}

function checkCategoryCode(categoryCode) {
  return checkCode(categoryCode);
}

function checkDetail(detail) {

}

function checkAll(title, categoryCode, detail) {
  return checkTitle(title) || checkCategoryCode(categoryCode) || checkDetail(detail)
}

export {
  checkTitle, checkCategoryCode, checkDetail, checkAll
}