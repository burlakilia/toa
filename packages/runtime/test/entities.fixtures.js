'use strict'

const randomstring = require('randomstring')

const schema = {
  fit: jest.fn((value) => {
    const ok = !value.invalid
    let oh

    if (!ok) oh = { message: 'error' }

    return { ok, oh }
  }),
  defaults: jest.fn(() => ({ [randomstring.generate()]: randomstring.generate() }))
}

const id = jest.fn(() => randomstring.generate())

const value = { [randomstring.generate()]: randomstring.generate() }

const system = {
  _created: randomstring.generate(),
  _updated: randomstring.generate(),
  _deleted: randomstring.generate(),
  _version: randomstring.generate()
}

exports.schema = schema
exports.id = id
exports.value = value
exports.system = system
