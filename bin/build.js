const path = require('path')

const { build, utils: { argv } } = require('..')

const cwd = process.cwd()
const webpackConfig = require(path.resolve(cwd, argv._[0]))

const defConfig = require('./build.config')
let config = argv.config ? require(path.resolve(cwd, argv.config)) : {}
config = Object.assign(defConfig, config)

build(webpackConfig, config)
