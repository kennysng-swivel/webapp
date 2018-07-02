const { argv } = require('..').utils

module.exports = {
  // whether to open the analysis report after build
  analyze: argv.analyze || true,

  // whether to do a clean build
  clean: argv.clean || true,

  // development or production
  mode: argv.mode || 'production'
}
