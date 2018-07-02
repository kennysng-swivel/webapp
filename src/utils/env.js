const debug = require('debug')('debug:utils/env')
const _ = require('lodash')
const path = require('path')

module.exports = jsonPath => {
  let env = {}
  if (jsonPath) {
    jsonPath = path.resolve(process.cwd(), jsonPath)
    try { env = require(jsonPath) } catch (e) { debug(`WARNING path '${jsonPath}' not exist`) }
  }
  return (process.env = _.merge(process.env, env))
}
