const assert = require('assert')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

module.exports = (webpackConfig, options = {}) => {
  assert(webpackConfig, 'ERROR please provide a webpackConfig')
  assert(typeof webpackConfig === 'object', 'ERROR webpackConfig should be an object')

  // build mode
  webpackConfig.mode = options.mode || webpackConfig.mode || 'development'

  const devServer = webpackConfig.devServer || {}
  const server = new WebpackDevServer(webpack(webpackConfig), devServer)
  server.listen(options.port || 3000, devServer.host || 'localhost', (err) => {
    if (err) throw err
    console.log(chalk.cyan('Starting the development server...\n'))

    // start event
    typeof options.onStart === 'function' && options.onStart(webpackConfig, options)
  })

  // stop on signal
  const signals = ['SIGINT', 'SIGTERM']
  signals.forEach(sig => {
    process.on(sig, () => {
      server.close()
      process.exit()
    })
  })
}
