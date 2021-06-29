import formatNumber from 'format-number'

function address(addr, symbols = 4) {
  return `${addr.slice(0, symbols)}...${addr.slice(addr.length - symbols)}`
}

function decimals(v, decimals) {
  return formatNumber({ truncate: decimals, integerSeparator: '' })(v)
}

function fiat(v, prefix, decimals = 2) {
  return formatNumber({ truncate: decimals, prefix })(v)
}

function btc(v, decimals, symbol) {
  return formatNumber({ truncate: decimals, suffix: ` ${symbol}` })(v)
}

export default {
  decimals,
  fiat,
  btc,
  address
}