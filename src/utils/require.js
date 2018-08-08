const caller = require('caller-callsite')
const path = require('path')

module.exports = id => {
  if (!path.isAbsolute(id)) {
    const callerPath = caller().getFileName()
    id = path.resolve(path.dirname(callerPath), id)
  }
  delete require.cache[id]
  return require(id)
}
