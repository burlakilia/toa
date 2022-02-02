'use strict'

const { compose } = require('../handlers/compose')

const builder = (yargs) => {
  yargs
    .positional('paths', {
      type: 'string',
      desc: 'Paths to packages',
      default: '.'
    })
    .array('paths')
    .option('bindings', {
      group: 'Command options:',
      type: 'string',
      desc: 'Bindings'
    })
    .array('bindings')
    .example([
      ['$0 compose ./component', 'Path to component package'],
      ['$0 compose ./first ./second', 'Paths enumeration'],
      ['$0 compose ./components/**/', 'Glob pattern'],
      ['$0 compose ./a/**/ ./b/**/', 'Glob patterns enumeration']
    ])
    .strictCommands()
}

exports.command = 'compose [paths...]'
exports.desc = 'Run composition'
exports.builder = builder
exports.handler = compose
