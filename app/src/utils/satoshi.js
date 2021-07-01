import bigInt from 'big-integer'

function from(units, decimals) {
  let f = trimRight(formatMoneyFull(units, decimals), '0');
  if (f[f.length - 1] === '.') {
    return f.slice(0, f.length - 1);
  }
  return f;
}

bigInt.prototype.exp10 =  function(decimals) {
  return this.multiply(new bigInt(10).pow(decimals))
}

function trimRight(str, char) {
  while (str[str.length - 1] == char) str = str.slice(0, -1);
  return str;
}

function padLeft(str, len, char) {
  while (str.length < len) {
    str = char + str
  }
  return str;
}

function to(str, decimals) {
  if (!str) return bigInt.zero;
  var negative = str[0] === '-'
  if (negative) {
    str = str.slice(1)
  }
  var decimalIndex = str.indexOf('.')
  if (decimalIndex == -1) {
    if (negative) {
      return (new bigInt(str)).multiply(new bigInt(10).pow(decimals)).negate()
    }
    return (new bigInt(str)).multiply(new bigInt(10).pow(decimals))
  }
  if (decimalIndex + decimals + 1 < str.length) {
    str = str.substr(0, decimalIndex + decimals + 1)
  }
  if (negative) {
    return new bigInt(str.substr(0, decimalIndex)).exp10(decimals)
      .add(new bigInt(str.substr(decimalIndex + 1)).exp10(decimalIndex + decimals - str.length + 1)).negate()
  }
  return new bigInt(str.substr(0, decimalIndex)).exp10(decimals)
    .add(new bigInt(str.substr(decimalIndex + 1)).exp10(decimalIndex + decimals - str.length + 1))
}

function formatMoneyFull(units, decimals) {
  units = units.toString();
  let symbol = units[0] === '-' ? '-' : ''
  if (symbol === '-') {
    units = units.slice(1);
  }
  let decimal;
  if (units.length >= decimals) {
    decimal = units.substr(units.length - decimals, decimals);
  } else {
    decimal = padLeft(units, decimals, '0')
  }
  return symbol + (units.substr(0, units.length - decimals) || '0') + '.' + decimal
}

export default {
  from, 
  to
}