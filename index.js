module.exports = {
  build: require('./src/build'),
  config: {
    build: require('./config/build.config'),
    start: require('./start/build.config')
  },
  start: require('./src/start'),
  utils: require('./src/utils')
}
