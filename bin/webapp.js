#!/usr/bin/env node

const assert = require('assert')
const chalk = require('chalk')
const childProcess = require('child_process')

const { utils: { argv } } = require('../')

switch (argv._[0]) {
  case 'build':
    assert(argv._[1], `please specify a webpack config file`)
    childProcess.fork('./build', process.argv.slice(3))
    break
  case 'start':
    assert(argv._[1], `please specify a webpack config file`)
    const main = () => childProcess.fork('./start', process.argv.slice(3))
    let proc = main()

    // refresh event
    process.openStdin().addListener('data', msg => {
      if (msg.trim() === 'rs') {
        proc.kill('SIGINT')
        proc = main()
      }
    })

    // stop on signal
    const signals = ['SIGINT', 'SIGTERM']
    signals.forEach(sig => {
      process.on(sig, () => {
        proc.kill(sig)
        process.exit()
      })
    })
    break
  case undefined:
    console.error(chalk.red(`please specify a command`))
    console.log(chalk.green(`usage: webapp {build|start} {webpack.config.js} [--config=webapp.config.js] [options]`))
    break
  default:
    console.error(chalk.red(`unknown command '${argv._[0]}'`))
    console.log(chalk.green(`usage: webapp {build|start} {webpack.config.js} [--config=webapp.config.js] [options]`))
    break
}
