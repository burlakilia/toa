'use strict'

const { generate } = require('randomstring')

const title = generate()
const input = generate()
const output = generate()
const request = { input }
const reply = { output }

const context = {}

context.declaration = {
  local: {
    do: {
      input: generate(),
      output: generate()
    },
    undo: {
      input: generate()
    },
    add: {
      output: generate()
    }
  }
}

context.sample = {
  local: {
    do: [{
      request: {
        input: context.declaration.local.do.input
      },
      reply: {
        output: context.declaration.local.do.output
      }
    }],
    undo: [{
      request: {
        input: context.declaration.local.undo.input
      }
    }],
    add: [{
      reply: {
        output: context.declaration.local.add.output
      }
    }]
  }
}

/** @type {toa.samples.Declaration} */
const declaration = { title, input, output, context: context.declaration }

/** @type {toa.samples.Sample} */
const expected = { title, request, reply, context: context.sample }

exports.declaration = declaration
exports.expected = expected
