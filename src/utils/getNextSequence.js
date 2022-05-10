exports.getNextSequence = (code) => {
  if(typeof code !== 'number' || typeof code !== 'string')
    throw Error(`First argument isn\'t number or string type : ${typeof code}`);
  let currNumber = Number(code);
  return String(++currNumber).padStart(3, '0');
}