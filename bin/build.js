const path = require('path')

const { build, config: { build: defConfig }, utils: { argv } } = require('..')

const cwd = process.cwd()
const webpackConfig = require(path.resolve(cwd, argv._[0]))

let config = argv.config ? require(path.resolve(cwd, argv.config)) : {}
config = Object.assign(defConfig, config)

build(webpackConfig, config)
