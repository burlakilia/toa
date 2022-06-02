'use strict'

const clone = require('clone-deep')

const { expand } = require('../../src/context/expand')
const fixtures = require('./expand.fixtures')

/** @type {toa.formation.context.Declaration | object} */
let context

beforeEach(() => {
  context = clone(fixtures.context)
})

it('should expand known annotations', () => {
  const resources = context.annotations['@toa.io/extensions.resources']
  delete context.annotations
  context.resources = resources

  expand(context)

  expect(context.annotations).toStrictEqual(fixtures.context.annotations)
})
