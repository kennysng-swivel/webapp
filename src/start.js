const assert = require('assert')
const chalk = require('chalk')
const debug = require('debug')('webapp:start')
const _ = require('lodash')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

module.exports = (webpackConfig, options = {}) => {
  assert(webpackConfig, 'ERROR please provide a webpackConfig')
  assert(
    Array.isArray(webpackConfig) || typeof webpackConfig === 'object',
    'ERROR webpackConfig should be an array or object'
  )

  if (!Array.isArray(webpackConfig)) webpackConfig = [webpackConfig]

  // build mode
  const mode = options.mode || 'production'
  webpackConfig.forEach(config => (config.mode = mode))
  debug(`INFO build mode = ${mode}`)

  // devServer options
  const devServer = webpackConfig.reduce((result, config) => {
    return _.merge(result, config.devServer || {})
  }, {})

  if (webpackConfig.length === 1) webpackConfig = webpackConfig[0]

  // beforeStart event
  Promise.resolve(typeof options.beforeStart === 'function' && options.beforeStart(webpackConfig, options))
    .then(() => {
      // create devServer
      const server = new WebpackDevServer(webpack(webpackConfig), devServer)

      // start devServer
      server.listen(options.port || 3000, devServer.host || 'localhost', err => {
        if (err) throw err
        console.log(chalk.cyan('Starting the development server...\n'))

        // start event
        typeof options.onStart === 'function' && options.onStart(webpackConfig, options)
      })

      // stop on signal
      const signals = ['SIGINT', 'SIGTERM']
      signals.forEach(sig => {
        process.on(sig, () => {
          // close event
          typeof options.onClose === 'function' && options.onClose(webpackConfig, options)

          server.close()
          process.exit()
        })
      })
    })
}
