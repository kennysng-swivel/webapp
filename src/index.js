const assert = require('assert')
const chalk = require('chalk')
const CleanPlugin = require('clean-webpack-plugin')
const debug = require('debug')('webapp')
const { EventEmitter } = require('events')
const util = require('util')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const WebpackDevServer = require('webpack-dev-server')

function WebApp (options) {
  this.options = {
    analyze: options.analyze,
    clean: options.clean,
    devServer: {
      ...(options.devServer || {}),
      host: options.host || 'localhost',
      hot: options.hot,
      hotOnly: options.hotOnly
    },
    mode: options.mode || process.env.NODE_ENV || 'development',
    port: options.port || 3000
  }
}

WebApp.prototype.fix = function (webpackConfig) {
  assert(webpackConfig, 'ERROR please provide a webpackConfig')
  assert(
    Array.isArray(webpackConfig) || typeof webpackConfig === 'object',
    'ERROR webpackConfig should be an array or object'
  )
  if (!Array.isArray(webpackConfig)) webpackConfig = [webpackConfig]
  for (const config of webpackConfig) config.mode = config.mode || this.options.mode
  if (webpackConfig.length === 1) webpackConfig = webpackConfig[0]
  return webpackConfig
}

WebApp.prototype.build = function (webpackConfig) {
  webpackConfig = this.webpackConfig = this.fix(webpackConfig)
  let timestamp = process.hrtime()
  this.emit('pre-build')
  console.log(chalk.bgGreen.black('Start building ...'))
  let count = webpackConfig.length || 1
  const compiler = this.webpackCompiler = webpack(webpackConfig)
  if (this.options.clean) {
    let paths = Array.isArray(webpackConfig)
      ? webpackConfig.map(config => config.output ? config.output.path : undefined)
      : [webpackConfig.output ? webpackConfig.output.path : undefined]
    paths = paths.reduce((result, path) => {
      if (path && !result.find(p => p === path)) {
        result.push(path)
      }
      return result
    }, [])
    if (paths.length > 0) {
      new CleanPlugin(paths, { root: process.cwd() }).apply(compiler)
      debug('INFO clean build enabled')
    } else {
      debug('WARN fail to enable clean build. no output path is declared')
    }
  }
  if (this.options.analyze) {
    new BundleAnalyzerPlugin({ analyzerPort: 0 }).apply(compiler)
    debug('INFO bundle analyzer enabled')
  }
  compiler.run((err, stats) => {
    if (err) throw err
    console[stats.hasErrors() ? 'error' : 'log'](stats.toString({ colors: true }))
    count -= 1
    if (!count) {
      this.on('post-build')
      timestamp = process.hrtime(timestamp)
      timestamp = Math.round((timestamp[0] * 1000) + (timestamp[1] / 1000000))
      console.log(chalk.bgGreen.black(`Build complete: ${timestamp}s`))
    }
  })
}

WebApp.prototype.start = function (webpackConfig) {
  webpackConfig = this.webpackConfig = this.fix(webpackConfig)
  WebpackDevServer.addDevServerEntrypoints(webpackConfig, this.options.devServer)
  const compiler = this.webpackCompiler = webpack(webpackConfig)
  if (this.options.devServer.hot || this.options.devServer.hotOnly) {
    new webpack.HotModuleReplacementPlugin().apply(compiler)
    debug('INFO Hot Module Replacement (HMR) enabled')
  }
  this.emit('pre-start')
  const server = this.webpackDevServer = new WebpackDevServer(compiler, this.options.devServer)
  server.listen(this.options.port, this.options.devServer.host, err => {
    if (err) throw err
    console.log(chalk.cyan('Starting the development server...\n'))
    this.emit('post-start')
  })
}

WebApp.prototype.restart = function () {
  const webpackConfig = this.webpackConfig
  this.emit('pre-restart')
  this.stop()
  this.once('post-start', function () {
    this.emit('post-restart')
  })
  this.start(webpackConfig)
}

WebApp.prototype.stop = function () {
  if (this.webpackDevServer) {
    this.emit('pre-stop')
    this.webpackDevServer.close()
    delete this.webpackDevServer
    delete this.webpackCompiler
    delete this.webpackConfig
    this.emit('post-stop')
  }
}

util.inherits(WebApp, EventEmitter)

module.exports = WebApp