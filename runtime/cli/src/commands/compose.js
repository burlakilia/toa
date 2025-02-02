// noinspection JSCheckFunctionSignatures

'use strict'

const { compose } = require('../handlers/compose')

const builder = (yargs) => {
  yargs
    .positional('paths', {
      type: 'string',
      desc: 'Paths to components',
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
      ['$0 compose ./component'],
      ['$0 compose ./first ./second'],
      ['$0 compose ./components/**/'],
      ['$0 compose ./a/**/ ./b/**/']
    ])
}

exports.command = 'compose [paths...]'
exports.desc = 'Run composition'
exports.builder = builder
exports.handler = compose
