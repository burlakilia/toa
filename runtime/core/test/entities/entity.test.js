'use strict'

const { Entity } = require('../../src/entities/entity')
const fixtures = require('./entity.fixtures')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('new', () => {
  it('should throw on schema error', () => {
    const entity = new Entity(fixtures.schema)

    expect(() => entity.set(fixtures.failed())).toThrow()
  })

  it('should provide state', () => {
    const entity = new Entity(fixtures.schema)
    const state = fixtures.state()

    entity.set(state)

    expect(entity.get()).toEqual(state)
  })
})

describe('argument', () => {
  it('should provide initial state if no argument passed', () => {
    const entity = new Entity(fixtures.schema)

    expect(entity.get()).toStrictEqual(fixtures.schema.defaults.mock.results[0].value)
  })

  it('should set provide origin state', () => {
    const state = fixtures.state()
    const entity = new Entity(fixtures.schema, state)

    expect(entity.get()).toStrictEqual(state)
  })
})

it('should provide event', () => {
  const origin = fixtures.state()
  const entity = new Entity(fixtures.schema, origin)
  const state = entity.get()

  state.foo = 'new value'
  entity.set(state)

  const event = entity.event()

  expect(event).toStrictEqual({
    state,
    origin: origin,
    changeset: { foo: 'new value' }
  })
})
