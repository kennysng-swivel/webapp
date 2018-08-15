#!/usr/bin/env node

const assert = require('assert')
const chalk = require('chalk')
const fallback = require('connect-history-api-fallback')
const express = require('express')
const fs = require('fs')
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

function startServer (host, port, path) {
  const app = express()
  app
    .use(fallback())
    .use(express.static(path))
    .listen(port, host, () => {
      const url = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`
      console.log(chalk.green(`You can visit the site at '${url}'\n`))
      openBrowser(url)
    })
}

let webApp
switch (argv._[0]) {
  case 'build':
    process.env.NODE_ENV = 'production'
    webApp = new WebApp(argv, events)
    webApp.build(noncacheRequire(webpackConfigPath))

    // test the built app
    webApp.on('post-build', function () {
      if (argv.open) {
        const host = webApp.options.devServer.host
        const port = webApp.options.devServer.port
        const buildPath = path.resolve(__root, argv.open)
        checkBrowsers(__root)
          .then(() => startServer(host, port, buildPath))
      }
    })
    break
  case 'test':
    assert(typeof argv._[1] === 'string', 'please specify a build path')
    fs.stat(argv._[1], (err, stat) => {
      if (err) throw err
      assert(stat.isDirectory(), 'please specify a valid build path')
      startServer(argv.host || 'localhost', argv.port || 3000, argv._[1])
    })
    break
  case 'start':
    process.env.NODE_ENV = 'development'
    if (argv.devServer) {
      argv.devServer = path.resolve(__root, argv.devServer)
      argv.devServer = require(argv.devServer)
    }
    webApp = new WebApp(argv, events)
    webApp.start(noncacheRequire(webpackConfigPath))

    // open the browser automatically on started
    webApp.on('post-start', function () {
      console.log(chalk.green('You can type \'rs\' to restart the development server\n'))

      if (argv.open) {
        let host = webApp.options.devServer.host
        if (host === '0.0.0.0') host = 'localhost'
        const port = webApp.options.devServer.port
        checkBrowsers(__root)
          .then(() => openBrowser(`http://${host}:${port}`))
      }
    })

    // type 'rs' to restart the development server
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
