// noinspection JSUnresolvedVariable

'use strict'

const yargs = require('yargs/yargs')

const { console } = require('@toa.io/console')
const { version } = require('@toa.io/runtime')

yargs(process.argv.slice(2))
  .parserConfiguration({
    'boolean-negation': false
  })
  .middleware((argv) => {
    if (argv.log === undefined) argv.log = process.env.TOA_DEBUG === '1' ? 'debug' : 'info'

    console.level(argv.log)
  })
  .fail((msg, err) => {
    const actual = err || new Error(msg)

    console.error(process.env.TOA_DEBUG === '1' ? actual : actual.message)

    process.exit(actual.exitCode > 0 ? actual.exitCode : 1)
  })
  .option('log', {
    describe: 'Log level'
  })
  .commandDir('./commands')
  .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
  .strict()
  .help()
  .version(version)
  .alias('h', 'help')
  .alias('v', 'version')
  .parse()

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})
