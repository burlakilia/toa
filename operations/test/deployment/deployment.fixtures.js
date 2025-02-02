'use strict'

const { generate } = require('randomstring')

const context = /** @type {toa.norm.Context} */ { name: generate() }
const compositions = []
const dependencies = []
const process = /** @type {toa.operations.Process} */ { execute: jest.fn() }
const options = /** @type {toa.deployment.installation.Options} */ {
  namespace: generate(),
  target: generate()
}

exports.context = context
exports.compositions = compositions
exports.dependencies = dependencies
exports.process = process
exports.options = options
