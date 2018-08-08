#!/usr/bin/env node

const assert = require('assert')
const chalk = require('chalk')
const path = require('path')
const openBrowser = require('react-dev-utils/openBrowser')

const WebApp = require('..')
const { argv, checkBrowsers, env } = WebApp.utils

const __root = process.cwd()

assert(typeof argv._[1] === 'string', `please specify a webpack config file`)
const webpackConfigPath = path.resolve(__root, argv._[1])

function noncacheRequire (id) {
  delete require.cache[require.resolve(id)]
  return require(id)
}

if (argv.env) {
  argv.env = path.resolve(__root, argv.env)
  env(argv.env)
}

let events
if (argv.events) {
  const eventsPath = path.resolve(__root, argv.events)
  events = require(eventsPath)
}

let webApp
switch (argv._[0]) {
  case 'build':
    process.env.NODE_ENV = 'production'
    webApp = new WebApp(argv, events)
    webApp.build(noncacheRequire(webpackConfigPath))
    break
  case 'start':
    process.env.NODE_ENV = 'development'
    webApp = new WebApp(argv, events)
    webApp.start(noncacheRequire(webpackConfigPath))

    webApp.on('post-start', function () {
      console.log(chalk.green('You can type \'rs\' to restart the development server\n'))

      if (argv.open) {
        checkBrowsers(__root)
          .then(() => openBrowser(`http://${webApp.options.devServer.host}:${webApp.options.port}`))
      }
    })
    process.openStdin().addListener('data', msg => {
      if (String(msg).trim() === 'rs') {
        webApp.emit('pre-restart')
        webApp.stop()
        webApp.once('post-start', function () {
          webApp.emit('post-restart')
        })
        webApp.start(noncacheRequire(webpackConfigPath))
      }
    })
    break
  case undefined:
    console.error(chalk.red(`please specify a command`))
    console.log(chalk.green(`usage: webapp {build|start} /path/to/webpack.config.js [options]`))
    break
  default:
    console.error(chalk.red(`unknown command '${argv._[0]}'`))
    console.log(chalk.green(`usage: webapp {build|start} /path/to/webpack.config.js [options]`))
    break
}
