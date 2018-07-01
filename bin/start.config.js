const openBrowser = require('react-dev-utils/openBrowser')

const { argv, checkBrowsers } = require('../src/utils')

module.exports = {
  // default set of target browsers
  defaultBrowsers: {
    development: ['chrome', 'firefox', 'edge'].map(
      browser => `last 2 ${browser} versions`
    ),
    production: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 11']
  },

  // development or production
  mode: argv.mode || 'development',

  // port used by webpack-dev-server
  port: argv.port || 3000,

  // project root
  root: process.cwd(),

  // start event
  onStart: options => {
    if (argv.open) {
      checkBrowsers(options.defaultBrowsers)(options.root)
        .then(() => openBrowser(`http://localhost:${argv.port || 3000}`))
    }
  }
}
