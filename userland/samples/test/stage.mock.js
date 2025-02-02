// noinspection JSCheckFunctionSignatures

'use strict'

const { generate } = require('randomstring')
const { Locator } = require('@toa.io/core')

const locator = () => {
  const name = generate()
  const namespace = generate()

  return new Locator(name, namespace)
}

// stage
const manifest = jest.fn(async (path) => ({ path, locator: locator() }))
const composition = jest.fn()
const shutdown = jest.fn()

const remote = jest.fn(async (id) => {
  const [namespace, name] = id.split('.')
  const locator = new Locator(name, namespace)
  const invoke = jest.fn(async (operation, request) => request.reply)
  const disconnect = jest.fn(async () => undefined)

  return { locator, invoke, disconnect }
})

const emit = jest.fn()
const binding = { binding: { emit } }

const stage = { manifest, composition, remote, shutdown, binding }

exports.stage = stage
