const assert = require('assert')
const chalk = require('chalk')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CleanPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = (webpackConfig, options = {}) => {
  assert(webpackConfig, 'ERROR please provide a webpackConfig')
  assert(typeof webpackConfig === 'object', 'ERROR webpackConfig should be an object')

  const root = process.cwd()

  // clean build folder
  if (options.clean && webpackConfig.output && webpackConfig.output.path) {
    const plugins = webpackConfig.plugins || []
    plugins.push(new CleanPlugin([webpackConfig.output.path], { root }))
    webpackConfig.plugins = plugins
  }

  // show anlysis report
  if (options.analyze) {
    const plugins = webpackConfig.plugins || []
    let analyzerOptions = typeof options.analyze === 'number' ? {
      analyzerPort: options.analyze
    } : undefined
    plugins.push(new BundleAnalyzerPlugin(analyzerOptions))
    webpackConfig.plugins = plugins
  }

  // build mode
  webpackConfig.mode = options.mode || webpackConfig.mode || 'production'

  // build event
  let timestamp = process.hrtime()
  console.log(chalk.bgGreen.black('Start building ...'))
  typeof options.onBuild === 'function' && options.onBuild(webpackConfig, options)

  webpack(webpackConfig, (err, stats) => {
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
}
