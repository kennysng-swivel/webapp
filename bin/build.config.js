const { argv } = require('..').utils

module.exports = {
  // whether to open the analysis report after build
  analyze: argv.analyze || false,

  // whether to do a clean build
  clean: argv.clean || false,

  // development or production
  mode: argv.mode || 'production'
}
