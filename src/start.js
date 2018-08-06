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
  const devServerOptions = webpackConfig.reduce((result, config) => {
    return _.merge(result, config.devServer || {})
  }, {})

  if (webpackConfig.length === 1) webpackConfig = webpackConfig[0]

  // beforeStart event
  Promise.resolve(typeof options.beforeStart === 'function' && options.beforeStart(webpackConfig, options))
    .then(() => {
      // add entry point for dev-server reload
      WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)

      // webpack compiler
      const compiler = webpack(webpackConfig)

      // enable hot reload
      if (options.hot) {
        devServerOptions.hot = true
        new webpack.HotModuleReplacementPlugin().apply(compiler)
        debug('INFO hot reload enabled')
      }

      // create devServer
      const server = new WebpackDevServer(compiler, devServerOptions)

      // start devServer
      server.listen(options.port || 3000, devServerOptions.host || 'localhost', err => {
        if (err) throw err
        console.log(chalk.cyan('Starting the development server...\n'))
        console.log(chalk.green('You can type \'rs\' to restart the development server\n'))

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
