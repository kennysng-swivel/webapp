const assert = require('assert')
const chalk = require('chalk')
const debug = require('debug')('debug:build')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CleanPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = (webpackConfig, options = {}) => {
  assert(webpackConfig, 'ERROR please provide a webpackConfig')
  assert(typeof webpackConfig === 'object', 'ERROR webpackConfig should be an object')

  const root = process.cwd()

  // build mode
  webpackConfig.mode = options.mode || webpackConfig.mode || 'production'
  debug(`INFO build mode = ${webpackConfig.mode}`)

  // build event
  let timestamp = process.hrtime()
  console.log(chalk.bgGreen.black('Start building ...'))
  Promise.resolve(typeof options.beforeBuild === 'function' && options.beforeBuild(webpackConfig, options))
    .then(() => {
      const compiler = webpack(webpackConfig, (err, stats) => {
        // runtime error
        if (err) throw err

        // build error
        if (stats.hasErrors()) {
          return console.error(stats.toString({ colors: true }))
        }

        // built event
        timestamp = process.hrtime(timestamp)
        timestamp = Math.round((timestamp[0] * 1000) + (timestamp[1] / 1000000))
        console.log(chalk.bgGreen.black(`Build complete: ${timestamp}s`))
        typeof options.onBuilt === 'function' && options.onBuilt(webpackConfig, options)
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
