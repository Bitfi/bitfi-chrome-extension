function address(addr, symbols = 4) {
  return `${addr.slice(0, symbols)}...${addr.slice(addr.length - symbols)}`
}

export default {
  address
}