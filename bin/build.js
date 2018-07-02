const { build, utils: { argv } } = require('../')

const webpackConfig = require(argv._[0])

const defConfig = require('./build.config')
let config = argv.config ? require(argv.config) : {}
config = Object.assign(defConfig, config)

build(webpackConfig, config)
