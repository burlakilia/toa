'use strict'

const { AssertionError } = require('node:assert')
const { dump } = require('@toa.io/libraries/yaml')

const { gherkin } = require('@toa.io/libraries/mock')
const { mock: schema } = require('./schema.fixtures')
const mock = { gherkin, schema }

const Schema = schema.Schema

jest.mock('@cucumber/cucumber', () => mock.gherkin)
jest.mock('../../../src/schema', () => mock.schema)

require('../schema')

it('should be', () => undefined)

/** @type {toa.schema.features.Context} */
let context

beforeEach(() => {
  context = {}
})

describe('Given I have a schema:', () => {
  const step = gherkin.steps.Gi('I have a schema:')

  it('should be', () => undefined)

  it('should define schema', () => {
    const schema = { type: 'number' }
    const yaml = dump(schema)

    step.call(context, yaml)

    expect(context.schema.schema).toStrictEqual(schema)
  })
})

describe('Given that schema is equivalent to:', () => {
  const step = gherkin.steps.Gi('that schema is equivalent to:')

  it('should be', () => undefined)

  it('should throw if no schema defined', () => {
    expect(() => step.call(context)).toThrow('No schema given')
  })

  it('should not pass if schemas mismatch', () => {
    const schema = { type: 'boolean' }
    const reference = { type: 'number' }
    const yaml = dump(reference)

    context.schema = new Schema(schema)

    expect(() => step.call(context, yaml)).toThrow(AssertionError)
  })

  it('should pass if schemas match', () => {
    const schema = 'number'
    const reference = { type: 'number' }
    const yaml = dump(reference)

    context.schema = new Schema(schema)

    expect(() => step.call(context, yaml)).not.toThrow(AssertionError)
  })
})
