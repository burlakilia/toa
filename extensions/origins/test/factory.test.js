'use strict'

const { generate } = require('randomstring')

const { Aspect } = require('../src/aspect')
const { Locator } = require('@toa.io/core')

const fixtures = require('./factory.fixtures')
const { Factory } = require('../src')

/** @type {toa.core.extensions.Factory} */
let factory

beforeEach(() => {
  factory = new Factory()
})

it('should create context extension', () => {
  const extension = factory.aspect(new Locator(generate(), generate()), fixtures.declaration)

  expect(extension).toBeInstanceOf(Aspect)
})
