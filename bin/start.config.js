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

  // open the web browser on start
  open: argv.open || false,

  // port used by webpack-dev-server
  port: argv.port || 3000,

  // project root
  root: process.cwd(),

  // beforeStart event
  beforeStart: (webpackConfig, { defaultBrowsers, open, root }) => {
    if (open) {
      return checkBrowsers(defaultBrowsers)(root)
    }
  },

  // start event
  onStart: (webpackConfig, { open, port }) => {
    if (open) {
      openBrowser(`http://localhost:${port}`)
    }
  }
}
