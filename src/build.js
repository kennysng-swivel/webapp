const assert = require('assert')
const chalk = require('chalk')
const debug = require('debug')('webapp:build')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CleanPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = (webpackConfig, options = {}) => {
  assert(webpackConfig, 'ERROR please provide a webpackConfig')
  assert(
    Array.isArray(webpackConfig) || typeof webpackConfig === 'object',
    'ERROR webpackConfig should be an array or object'
  )

  const root = process.cwd()

  if (!Array.isArray(webpackConfig)) webpackConfig = [webpackConfig]

  // build mode
  const mode = options.mode || 'production'
  webpackConfig.forEach(config => (config.mode = mode))
  debug(`INFO build mode = ${mode}`)

  if (webpackConfig.length === 1) webpackConfig = webpackConfig[0]

  let timestamp = process.hrtime()
  console.log(chalk.bgGreen.black('Start building ...'))

  // beforeStart event
  Promise.resolve(typeof options.beforeBuild === 'function' && options.beforeBuild(webpackConfig, options))
    .then(() => {
      let count = webpackConfig.length || 1

      // build with webpack
      const compiler = webpack(webpackConfig, (err, stats) => {
        // runtime error
        if (err) throw err

        // show logs
        console[stats.hasErrors() ? 'error' : 'log'](stats.toString({ colors: true }))

        count -= 1

        // built event
        if (!count) {
          typeof options.onBuilt === 'function' && options.onBuilt(webpackConfig, options)

          timestamp = process.hrtime(timestamp)
          timestamp = Math.round((timestamp[0] * 1000) + (timestamp[1] / 1000000))
          console.log(chalk.bgGreen.black(`Build complete: ${timestamp}s`))
        }
      })

      // clean build folder
      if (options.clean && webpackConfig.output && webpackConfig.output.path) {
        new CleanPlugin([webpackConfig.output.path], { root }).apply(compiler)
        debug('INFO clean build enabled')
      }

      // show analysis report
      if (options.analyze) {
        let analyzerOptions = typeof options.analyze === 'number' ? {
          analyzerPort: options.analyze
        } : undefined
        new BundleAnalyzerPlugin(analyzerOptions).apply(compiler)
        debug('INFO bundle analyzer enabled')
      }
    })
}
