
function isHex(h) {
  var a = parseInt(h,16);
  return (a.toString(16) ===h.toLowerCase())
}

export const notEmpty = v => !v? 'Please, enter value' : undefined
export const lengthOf = len => v => v && (v.length !== len)? `Enter ${len} charecters`: undefined
export const isHex = v => !isHex(v)? 'Enter hex values' : undefined
