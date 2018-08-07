module.exports = id => {
  delete require.cache[require.resolve(id)]
  return require(id)
}
