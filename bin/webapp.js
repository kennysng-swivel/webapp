#!/usr/bin/env node

const assert = require('assert')
const chalk = require('chalk')

const { build, start, utils: { argv } } = require('../')

switch (argv._[0]) {
  case 'build':
    let webpackConfig
    assert(argv._[1], `please specify a webpack config file`)
    try {
      webpackConfig = require(argv._[1])
    } catch (e) {
      return chalk.error(`webpack config file '${argv._[1]}' is not found`)
    }
    argv._ = argv._.slice(2)
    let options = argv.config ? require(argv.config) : {}
    let defOptions = require('./build.config.js')
    return build(webpackConfig, Object.assign(defOptions, options))
  case 'start':
    assert(argv._[1], `please specify a webpack config file`)
    try {
      webpackConfig = require(argv._[1])
    } catch (e) {
      return chalk.error(`webpack config file '${argv._[1]}' is not found`)
    }
    argv._ = argv._.slice(2)
    options = argv.config ? require(argv.config) : {}
    defOptions = require('./start.config.js')
    return start(webpackConfig, Object.assign(defOptions, options))
  case undefined:
    console.error(chalk.red(`please specify a command`))
    console.log(chalk.green(`usage: webapp {build|start} {webpack.config.js} [--config=webapp.config.js] [options]`))
    break
  default:
    console.error(chalk.red(`unknown command '${argv._[0]}'`))
    console.log(chalk.green(`usage: webapp {build|start} {webpack.config.js} [--config=webapp.config.js] [options]`))
    break
}
