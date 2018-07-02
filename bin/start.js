const { start, utils: { argv } } = require('../')

const webpackConfig = require(argv._[0])

const defConfig = require('./start.config')
let config = argv.config ? require(argv.config) : {}
config = Object.assign(defConfig, config)

start(webpackConfig, config)
