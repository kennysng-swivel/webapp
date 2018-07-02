const openBrowser = require('react-dev-utils/openBrowser')

const { argv, checkBrowsers } = require('..').utils

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

  // before start event
  beforeState: (webpackConfig, options) => {
    if (argv.open) {
      return checkBrowsers(options.defaultBrowsers)(options.root)
    }
  },

  // start event
  onStart: () => {
    if (argv.open) {
      openBrowser(`http://localhost:${argv.port || 3000}`)
    }
  }
}
