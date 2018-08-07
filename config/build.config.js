const express = require('express')
const fallback = require('connect-history-api-fallback')
const openBrowser = require('react-dev-utils/openBrowser')

const { argv, checkBrowsers } = require('..').utils

module.exports = {
  // whether to open the analysis report after build
  analyze: argv.analyze || false,

  // whether to do a clean build
  clean: argv.clean || false,

  // default set of target browsers
  defaultBrowsers: {
    development: ['chrome', 'firefox', 'edge'].map(
      browser => `last 2 ${browser} versions`
    ),
    production: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 11']
  },

  // development or production
  mode: argv.mode || 'production',

  // port for testing server
  port: argv.port || 3000,

  // project root
  root: process.cwd(),

  // whether to test the output
  test: argv.test || false,

  // beforeBuild event
  beforeBuild: (webpackConfig, options) => {
    if (options.test) {
      const { defaultBrowsers, root } = options
      return checkBrowsers(defaultBrowsers)(root)
    }
  },

  // built event
  onBuilt: (webpackConfig, options) => {
    if (options.test) {
      const { output: { path } } = webpackConfig
      const { port } = options
      const app = express()
      app
        .use(fallback())
        .use(express.static(path))
        .listen(port, '0.0.0.0', () => {
          openBrowser(`http://localhost:${port}`)
        })
    }
  }
}
